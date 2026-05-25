using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;
using PacificLuxe.Api.Features.Reservations;

namespace PacificLuxe.Api.Features.Operations;

public sealed class OperationsService : IOperationsService
{
    private readonly AppDbContext _db;
    private readonly IReservationService _reservations;

    public OperationsService(AppDbContext db, IReservationService reservations)
    {
        _db = db;
        _reservations = reservations;
    }

    public async Task<(PickupChecklistDto? Dto, OperationsServiceError? Error)> RecordPickupAsync(
        Guid reservationId,
        RecordPickupRequest request,
        CancellationToken ct = default)
    {
        var validation = ValidatePickupRequest(request);
        if (validation != null)
            return (null, validation);

        var reservation = await _db.Reservations
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, NotFound("Reservation not found."));

        if (!CanRecordPickup(reservation.Status))
            return (null, Conflict(
                "Pickup can only be recorded when the reservation is Confirmed or Active."));

        var completedAt = DateTime.UtcNow;

        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        var entity = await _db.PickupChecklists.FirstOrDefaultAsync(p => p.ReservationId == reservationId, ct);
        if (entity == null)
        {
            entity = new PickupChecklist { ReservationId = reservationId };
            _db.PickupChecklists.Add(entity);
        }

        entity.OdometerOut = request.OdometerOut;
        entity.FuelOrChargeOutPercent = request.FuelOrChargeOutPercent;
        entity.ConditionNotes = string.IsNullOrWhiteSpace(request.ConditionNotes) ? null : request.ConditionNotes.Trim();
        entity.CompletedAtUtc = completedAt;
        entity.CompletedBy = request.CompletedBy.Trim();

        await _db.SaveChangesAsync(ct);

        if (reservation.Status == ReservationStatus.Confirmed)
        {
            var (ok, err) = await _reservations.UpdateReservationStatusAsync(
                reservationId,
                new UpdateReservationStatusRequest(ReservationStatus.Active),
                ct);

            if (!ok)
            {
                await tx.RollbackAsync(ct);
                return (null, BadRequest(err ?? "Could not transition reservation to Active."));
            }
        }

        await tx.CommitAsync(ct);

        return (MapPickup(entity), null);
    }

    public async Task<(ReturnChecklistDto? Dto, OperationsServiceError? Error)> RecordReturnAsync(
        Guid reservationId,
        RecordReturnRequest request,
        CancellationToken ct = default)
    {
        var validation = ValidateReturnRequest(request);
        if (validation != null)
            return (null, validation);

        var reservation = await _db.Reservations
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, NotFound("Reservation not found."));

        if (!CanRecordReturn(reservation.Status))
            return (null, Conflict(
                "Return can only be recorded when the reservation is Active or Returned."));

        var completedAt = DateTime.UtcNow;

        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        var entity = await _db.ReturnChecklists.FirstOrDefaultAsync(r => r.ReservationId == reservationId, ct);
        if (entity == null)
        {
            entity = new ReturnChecklist { ReservationId = reservationId };
            _db.ReturnChecklists.Add(entity);
        }

        entity.OdometerIn = request.OdometerIn;
        entity.FuelOrChargeInPercent = request.FuelOrChargeInPercent;
        entity.ConditionNotes = string.IsNullOrWhiteSpace(request.ConditionNotes) ? null : request.ConditionNotes.Trim();
        entity.CompletedAtUtc = completedAt;
        entity.CompletedBy = request.CompletedBy.Trim();

        await _db.SaveChangesAsync(ct);

        if (reservation.Status == ReservationStatus.Active)
        {
            var (ok, err) = await _reservations.UpdateReservationStatusAsync(
                reservationId,
                new UpdateReservationStatusRequest(ReservationStatus.Returned),
                ct);

            if (!ok)
            {
                await tx.RollbackAsync(ct);
                return (null, BadRequest(err ?? "Could not transition reservation to Returned."));
            }
        }

        await tx.CommitAsync(ct);

        return (MapReturn(entity), null);
    }

    public async Task<(AdditionalChargeDto? Dto, OperationsServiceError? Error)> CreateChargeAsync(
        Guid reservationId,
        CreateAdditionalChargeRequest request,
        CancellationToken ct = default)
    {
        if (request.Amount <= 0)
            return (null, BadRequest("Amount must be greater than zero."));

        var currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.Trim().ToUpperInvariant();
        if (currency.Length > 10)
            return (null, BadRequest("Currency is invalid."));

        var reservation = await _db.Reservations.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, NotFound("Reservation not found."));

        if (!CanMutateCharges(reservation.Status))
            return (null, Conflict(
                "Additional charges can only be added while the reservation is Active or Returned."));

        var charge = new AdditionalCharge
        {
            ReservationId = reservationId,
            ChargeType = request.Type,
            Amount = request.Amount,
            Currency = currency,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
        };

        _db.AdditionalCharges.Add(charge);
        await _db.SaveChangesAsync(ct);

        return (MapCharge(charge), null);
    }

    public async Task<(AdditionalChargeDto? Dto, OperationsServiceError? Error)> UpdateChargeAsync(
        Guid chargeId,
        UpdateAdditionalChargeRequest request,
        CancellationToken ct = default)
    {
        var charge = await _db.AdditionalCharges
            .Include(c => c.Reservation)
            .FirstOrDefaultAsync(c => c.Id == chargeId, ct);

        if (charge == null)
            return (null, NotFound("Charge not found."));

        if (!CanMutateCharges(charge.Reservation.Status))
            return (null, Conflict(
                "Charges can only be updated while the reservation is Active or Returned."));

        if (request.Amount.HasValue)
        {
            if (request.Amount.Value <= 0)
                return (null, BadRequest("Amount must be greater than zero."));
            charge.Amount = request.Amount.Value;
        }

        if (request.Type.HasValue)
            charge.ChargeType = request.Type.Value;

        if (request.Currency != null)
        {
            var c = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.Trim().ToUpperInvariant();
            if (c.Length > 10)
                return (null, BadRequest("Currency is invalid."));
            charge.Currency = c;
        }

        if (request.Notes != null)
            charge.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();

        await _db.SaveChangesAsync(ct);

        return (MapCharge(charge), null);
    }

    public async Task<(bool Success, OperationsServiceError? Error)> DeleteChargeAsync(
        Guid chargeId,
        CancellationToken ct = default)
    {
        var charge = await _db.AdditionalCharges
            .Include(c => c.Reservation)
            .FirstOrDefaultAsync(c => c.Id == chargeId, ct);

        if (charge == null)
            return (false, NotFound("Charge not found."));

        if (!CanMutateCharges(charge.Reservation.Status))
            return (false, Conflict(
                "Charges can only be deleted while the reservation is Active or Returned."));

        _db.AdditionalCharges.Remove(charge);
        await _db.SaveChangesAsync(ct);

        return (true, null);
    }

    public async Task<(ReservationOperationsDto? Dto, OperationsServiceError? Error)> GetOperationsAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var r = await _db.Reservations
            .AsNoTracking()
            .Include(x => x.PickupChecklist)
            .Include(x => x.ReturnChecklist)
            .Include(x => x.AdditionalCharges)
            .FirstOrDefaultAsync(x => x.Id == reservationId, ct);

        if (r == null)
            return (null, NotFound("Reservation not found."));

        var pickup = r.PickupChecklist == null ? null : MapPickup(r.PickupChecklist);
        var ret = r.ReturnChecklist == null ? null : MapReturn(r.ReturnChecklist);
        var charges = r.AdditionalCharges.OrderByDescending(c => c.CreatedAtUtc).Select(MapCharge).ToList();

        return (new ReservationOperationsDto(
            r.Id,
            r.Status.ToString(),
            pickup,
            ret,
            charges), null);
    }

    public async Task<(bool Success, OperationsServiceError? Error)> CompleteReservationAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (false, NotFound("Reservation not found."));

        if (!CanComplete(reservation.Status))
            return (false, Conflict(
                "Reservation can only be completed from Returned status."));

        var (ok, err) = await _reservations.UpdateReservationStatusAsync(
            reservationId,
            new UpdateReservationStatusRequest(ReservationStatus.Completed),
            ct);

        if (!ok)
            return (false, BadRequest(err ?? "Could not complete reservation."));

        return (true, null);
    }

    private static bool CanRecordPickup(ReservationStatus s) =>
        s is ReservationStatus.Confirmed or ReservationStatus.Active;

    private static bool CanRecordReturn(ReservationStatus s) =>
        s is ReservationStatus.Active or ReservationStatus.Returned;

    private static bool CanMutateCharges(ReservationStatus s) =>
        s is ReservationStatus.Active or ReservationStatus.Returned;

    private static bool CanComplete(ReservationStatus s) =>
        s is ReservationStatus.Returned;

    private static OperationsServiceError? ValidatePickupRequest(RecordPickupRequest request)
    {
        if (request.OdometerOut < 0)
            return BadRequest("Odometer out must be zero or greater.");
        if (request.FuelOrChargeOutPercent is < 0 or > 100)
            return BadRequest("Fuel or charge out must be between 0 and 100 percent.");
        if (string.IsNullOrWhiteSpace(request.CompletedBy))
            return BadRequest("CompletedBy is required.");
        return null;
    }

    private static OperationsServiceError? ValidateReturnRequest(RecordReturnRequest request)
    {
        if (request.OdometerIn < 0)
            return BadRequest("Odometer in must be zero or greater.");
        if (request.FuelOrChargeInPercent is < 0 or > 100)
            return BadRequest("Fuel or charge in must be between 0 and 100 percent.");
        if (string.IsNullOrWhiteSpace(request.CompletedBy))
            return BadRequest("CompletedBy is required.");
        return null;
    }

    private static PickupChecklistDto MapPickup(PickupChecklist p) =>
        new(
            p.Id,
            p.OdometerOut,
            p.FuelOrChargeOutPercent,
            p.ConditionNotes,
            p.CompletedAtUtc,
            p.CompletedBy);

    private static ReturnChecklistDto MapReturn(ReturnChecklist r) =>
        new(
            r.Id,
            r.OdometerIn,
            r.FuelOrChargeInPercent,
            r.ConditionNotes,
            r.CompletedAtUtc,
            r.CompletedBy);

    private static AdditionalChargeDto MapCharge(AdditionalCharge c) =>
        new(
            c.Id,
            c.ReservationId,
            c.ChargeType,
            c.Amount,
            c.Currency,
            c.Notes,
            c.CreatedAtUtc,
            c.UpdatedAtUtc);

    private static OperationsServiceError NotFound(string detail) =>
        new(StatusCodes.Status404NotFound, "Not Found", detail);

    private static OperationsServiceError BadRequest(string detail) =>
        new(StatusCodes.Status400BadRequest, "Bad Request", detail);

    private static OperationsServiceError Conflict(string detail) =>
        new(StatusCodes.Status409Conflict, "Conflict", detail);
}
