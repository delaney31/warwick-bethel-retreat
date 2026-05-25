using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PacificLuxe.Api.Configuration;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;
using PacificLuxe.Api.Features.Availability;
using PacificLuxe.Api.Features.Email;
using PacificLuxe.Api.Services;

namespace PacificLuxe.Api.Features.Reservations;

public class ReservationService : IReservationService
{
    private readonly AppDbContext _db;
    private readonly IAvailabilityService _availabilityService;
    private readonly IReservationStatusEmailNotifier _statusEmailNotifier;
    private readonly ProductLineOptions _productLine;

    public ReservationService(
        AppDbContext db,
        IAvailabilityService availabilityService,
        IReservationStatusEmailNotifier statusEmailNotifier,
        IOptions<ProductLineOptions> productLine)
    {
        _db = db;
        _availabilityService = availabilityService;
        _statusEmailNotifier = statusEmailNotifier;
        _productLine = productLine.Value;
    }

    public async Task<(ReservationCreatedDto? Dto, string? Error)> CreateReservationAsync(CreateReservationRequest request, CancellationToken ct = default)
    {
        var validationError = ValidateCreateRequest(request);
        if (validationError != null)
            return (null, validationError);

        var vehicle = await _db.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.Id == request.VehicleId, ct);
        if (vehicle == null)
            return (null, "Vehicle not found.");

        if (vehicle.Status != VehicleStatus.Available)
            return (null, "Vehicle is not available for booking.");

        var isAvailable = await _availabilityService.IsVehicleAvailableForDatesAsync(
            request.VehicleId, request.StartDate, request.EndDate, excludeReservationId: null, ct);

        if (!isAvailable)
            return (null, "The selected date range is not available. It may overlap with an existing reservation or availability block.");

        var reservation = new Reservation
        {
            VehicleId = request.VehicleId,
            RenterName = request.RenterName.Trim(),
            RenterEmail = request.RenterEmail.Trim(),
            RenterPhone = request.RenterPhone?.Trim() ?? "",
            StartDateUtc = request.StartDate,
            EndDateUtc = request.EndDate,
            PickupPreference = request.PickupPreference,
            DriverAge = request.DriverAge,
            Notes = request.Notes?.Trim() ?? "",
            Status = ReservationStatus.PendingReview,
            Agreement = new SignedAgreement
            {
                Status = AgreementStatus.NotSent,
            },
        };

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync(ct);

        return (new ReservationCreatedDto(reservation.Id, reservation.Status.ToString()), null);
    }

    public async Task<IReadOnlyList<ReservationSummaryDto>> GetReservationsAsync(ReservationStatus? statusFilter, CancellationToken ct = default)
    {
        var query = _db.Reservations
            .AsNoTracking()
            .Include(r => r.Vehicle)
            .AsQueryable();

        if (statusFilter.HasValue)
            query = query.Where(r => r.Status == statusFilter.Value);

        var rows = await query
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync(ct);

        return rows.Select(r =>
        {
            var (dailyRate, subtotal) = RetreatPricing.ForReservation(r.Vehicle, r);
            var nights = RetreatPricing.RentalDays(r.StartDateUtc, r.EndDateUtc);
            return new ReservationSummaryDto(
                r.Id,
                r.VehicleId,
                r.Vehicle.DisplayName,
                r.Status.ToString(),
                r.RenterName,
                r.RenterEmail,
                r.RenterPhone,
                r.StartDateUtc,
                r.EndDateUtc,
                r.PickupPreference.ToString(),
                r.DriverAge,
                r.Notes,
                nights,
                dailyRate,
                subtotal,
                r.CreatedAtUtc);
        }).ToList();
    }

    public async Task<ReservationDetailDto?> GetReservationByIdAsync(Guid id, CancellationToken ct = default)
    {
        var r = await _db.Reservations
            .AsNoTracking()
            .Include(x => x.Vehicle)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (r == null)
            return null;

        return new ReservationDetailDto(
            r.Id,
            r.VehicleId,
            r.Vehicle.DisplayName,
            r.Status.ToString(),
            r.RenterName,
            r.RenterEmail,
            r.RenterPhone,
            r.StartDateUtc,
            r.EndDateUtc,
            r.PickupPreference.ToString(),
            r.DriverAge,
            r.Notes,
            r.CreatedAtUtc);
    }

    public async Task<(bool Success, string? Error)> UpdateReservationStatusAsync(Guid id, UpdateReservationStatusRequest request, CancellationToken ct = default)
    {
        var reservation = await _db.Reservations
            .Include(r => r.Vehicle)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
        if (reservation == null)
            return (false, "Reservation not found.");

        var error = ValidateStatusTransition(reservation.Status, request.Status);
        if (error != null)
            return (false, error);

        var previousStatus = reservation.Status;
        reservation.Status = request.Status;
        await _db.SaveChangesAsync(ct);

        await _statusEmailNotifier.NotifyStatusChangedAsync(reservation, previousStatus, request.Status, request.Message, ct);

        return (true, null);
    }

    private string? ValidateCreateRequest(CreateReservationRequest r)
    {
        if (string.IsNullOrWhiteSpace(r.RenterName))
            return "Renter name is required.";
        if (string.IsNullOrWhiteSpace(r.RenterEmail))
            return "Renter email is required.";
        if (r.StartDate > r.EndDate)
            return "End date must be on or after start date.";
        var rentalDays = r.EndDate.DayNumber - r.StartDate.DayNumber + 1;
        if (rentalDays < 1)
            return "Invalid date range.";
        if (_productLine.IsRetreat)
        {
            if (r.DriverAge < 1 || r.DriverAge > 6)
                return "Guest count must be between 1 and 6.";
        }
        else if (r.DriverAge < 21)
        {
            return "Driver must be at least 21 years old.";
        }

        return null;
    }

    /// <summary>
    /// Validates status transitions per RESERVATION_LIFECYCLE.md.
    /// </summary>
    private string? ValidateStatusTransition(ReservationStatus from, ReservationStatus to)
    {
        if (from == to)
            return "Status is already set to the requested value.";

        var terminal = new[] { ReservationStatus.Rejected, ReservationStatus.Completed, ReservationStatus.Cancelled };
        if (terminal.Contains(from))
            return "Cannot change status of a reservation in a terminal state.";

        var allowed = GetAllowedTransitions();
        if (!allowed.TryGetValue(from, out var toStates) || !toStates.Contains(to))
            return $"Transition from {from} to {to} is not allowed. See RESERVATION_LIFECYCLE.md for valid transitions.";

        return null;
    }

    private Dictionary<ReservationStatus, HashSet<ReservationStatus>> GetAllowedTransitions()
    {
        if (_productLine.IsRetreat)
        {
            return new Dictionary<ReservationStatus, HashSet<ReservationStatus>>
            {
                [ReservationStatus.PendingReview] =
                [
                    ReservationStatus.AwaitingPayment,
                    ReservationStatus.Rejected,
                    ReservationStatus.Cancelled,
                ],
                [ReservationStatus.AwaitingPayment] = [ReservationStatus.Confirmed, ReservationStatus.Cancelled],
                [ReservationStatus.Confirmed] = [ReservationStatus.Completed, ReservationStatus.Cancelled],
            };
        }

        return new Dictionary<ReservationStatus, HashSet<ReservationStatus>>
        {
            [ReservationStatus.PendingReview] = [ReservationStatus.Approved, ReservationStatus.Rejected, ReservationStatus.Cancelled],
            [ReservationStatus.Approved] =
            [
                ReservationStatus.DocumentsSubmitted,
                ReservationStatus.AgreementSent,
                ReservationStatus.Cancelled,
            ],
            [ReservationStatus.DocumentsSubmitted] =
            [
                ReservationStatus.DocumentsApproved,
                ReservationStatus.Approved,
                ReservationStatus.Cancelled,
            ],
            [ReservationStatus.DocumentsApproved] =
            [
                ReservationStatus.AgreementSent,
                ReservationStatus.AgreementSigned,
                ReservationStatus.Cancelled,
            ],
            [ReservationStatus.AgreementSent] =
            [
                ReservationStatus.AwaitingPayment,
                ReservationStatus.Cancelled,
            ],
            [ReservationStatus.AgreementSigned] =
            [
                ReservationStatus.AwaitingPayment,
                ReservationStatus.Confirmed,
                ReservationStatus.Cancelled,
            ],
            [ReservationStatus.AwaitingPayment] = [ReservationStatus.Confirmed, ReservationStatus.Cancelled],
            [ReservationStatus.Confirmed] = [ReservationStatus.Active, ReservationStatus.Cancelled],
            [ReservationStatus.Active] = [ReservationStatus.Returned],
            [ReservationStatus.Returned] = [ReservationStatus.Completed],
        };
    }
}
