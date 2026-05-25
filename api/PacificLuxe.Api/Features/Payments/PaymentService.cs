using Microsoft.EntityFrameworkCore;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;
using PacificLuxe.Api.Features.Reservations;

namespace PacificLuxe.Api.Features.Payments;

public sealed class PaymentService : IPaymentService
{
    private readonly AppDbContext _db;
    private readonly IReservationService _reservations;

    public PaymentService(AppDbContext db, IReservationService reservations)
    {
        _db = db;
        _reservations = reservations;
    }

    public async Task<(PaymentDto? Dto, PaymentServiceError? Error)> CreateAsync(
        Guid reservationId,
        CreatePaymentRequest request,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, new PaymentServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        if (reservation.Status is not ReservationStatus.AwaitingPayment and not ReservationStatus.Confirmed)
            return (null, new PaymentServiceError(
                StatusCodes.Status409Conflict,
                "Conflict",
                "Payments can only be created when the reservation is AwaitingPayment or Confirmed."));

        if (request.Amount <= 0)
            return (null, new PaymentServiceError(StatusCodes.Status400BadRequest, "Bad Request", "Amount must be greater than zero."));

        var currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.Trim().ToUpperInvariant();
        if (currency.Length > 10)
            return (null, new PaymentServiceError(StatusCodes.Status400BadRequest, "Bad Request", "Currency is invalid."));

        var payment = new Payment
        {
            ReservationId = reservationId,
            Amount = request.Amount,
            Currency = currency,
            Status = PaymentStatus.Pending,
            Label = string.IsNullOrWhiteSpace(request.Label) ? null : request.Label.Trim(),
            InternalNotes = string.IsNullOrWhiteSpace(request.InternalNotes) ? null : request.InternalNotes.Trim(),
            Provider = "none",
        };

        _db.Payments.Add(payment);
        await _db.SaveChangesAsync(ct);

        return (Map(payment), null);
    }

    public async Task<(PaymentDto? Dto, PaymentServiceError? Error)> UpdateStatusAsync(
        Guid paymentId,
        UpdatePaymentStatusRequest request,
        CancellationToken ct = default)
    {
        var payment = await _db.Payments
            .Include(p => p.Reservation)
            .FirstOrDefaultAsync(p => p.Id == paymentId, ct);

        if (payment == null)
            return (null, new PaymentServiceError(StatusCodes.Status404NotFound, "Not Found", "Payment not found."));

        var error = ValidateStatusChange(payment.Status, request.Status);
        if (error != null)
            return (null, new PaymentServiceError(StatusCodes.Status409Conflict, "Conflict", error));

        var previous = payment.Status;
        payment.Status = request.Status;

        if (!string.IsNullOrWhiteSpace(request.InternalNotes))
            payment.InternalNotes = request.InternalNotes.Trim();

        var now = DateTime.UtcNow;
        switch (request.Status)
        {
            case PaymentStatus.Paid:
                payment.PaidAtUtc = now;
                payment.FailedAtUtc = null;
                break;
            case PaymentStatus.Failed:
                payment.FailedAtUtc = now;
                break;
            case PaymentStatus.Refunded:
                payment.RefundedAtUtc = now;
                break;
            case PaymentStatus.Pending:
                payment.PaidAtUtc = null;
                payment.FailedAtUtc = null;
                payment.RefundedAtUtc = null;
                break;
            case PaymentStatus.NotRequested:
                payment.PaidAtUtc = null;
                payment.FailedAtUtc = null;
                payment.RefundedAtUtc = null;
                break;
        }

        var needsReservationConfirm = request.Status == PaymentStatus.Paid
            && previous != PaymentStatus.Paid
            && payment.Reservation.Status == ReservationStatus.AwaitingPayment;

        if (needsReservationConfirm)
        {
            await using var tx = await _db.Database.BeginTransactionAsync(ct);
            try
            {
                await _db.SaveChangesAsync(ct);
                var (ok, resError) = await _reservations.UpdateReservationStatusAsync(
                    payment.Reservation.Id,
                    new UpdateReservationStatusRequest(ReservationStatus.Confirmed),
                    ct);

                if (!ok)
                {
                    await tx.RollbackAsync(ct);
                    return (null, new PaymentServiceError(
                        StatusCodes.Status409Conflict,
                        "Conflict",
                        resError ?? "Reservation could not move to Confirmed."));
                }

                await tx.CommitAsync(ct);
            }
            catch
            {
                await tx.RollbackAsync(ct);
                throw;
            }
        }
        else
        {
            await _db.SaveChangesAsync(ct);
        }

        await _db.Entry(payment).ReloadAsync(ct);
        return (Map(payment), null);
    }

    public async Task<(IReadOnlyList<PaymentDto>? List, PaymentServiceError? Error)> ListForReservationAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var exists = await _db.Reservations.AsNoTracking().AnyAsync(r => r.Id == reservationId, ct);
        if (!exists)
            return (null, new PaymentServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        var list = await _db.Payments.AsNoTracking()
            .Where(p => p.ReservationId == reservationId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(ct);

        return (list.Select(Map).ToList(), null);
    }

    public async Task<(PaymentPublicDto? Dto, PaymentServiceError? Error)> GetPublicAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, new PaymentServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        var payments = await _db.Payments.AsNoTracking()
            .Where(p => p.ReservationId == reservationId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(ct);

        if (payments.Count == 0)
        {
            return (new PaymentPublicDto(
                reservationId,
                reservation.Status.ToString(),
                PaymentStatus.NotRequested.ToString(),
                null,
                "USD",
                null,
                null), null);
        }

        var chosen = payments.FirstOrDefault(p => p.Status == PaymentStatus.Pending)
            ?? payments.FirstOrDefault(p => p.Status == PaymentStatus.Paid)
            ?? payments[0];

        return (new PaymentPublicDto(
            reservationId,
            reservation.Status.ToString(),
            chosen.Status.ToString(),
            chosen.Amount,
            chosen.Currency,
            chosen.PaidAtUtc,
            chosen.Label), null);
    }

    private static string? ValidateStatusChange(PaymentStatus from, PaymentStatus to)
    {
        if (from == to)
            return "Status is already set to the requested value.";

        return (from, to) switch
        {
            (PaymentStatus.Pending, PaymentStatus.Paid) => null,
            (PaymentStatus.Pending, PaymentStatus.Failed) => null,
            (PaymentStatus.Failed, PaymentStatus.Pending) => null,
            (PaymentStatus.Paid, PaymentStatus.Refunded) => null,
            (PaymentStatus.Pending, PaymentStatus.NotRequested) => null,
            _ => $"Cannot change payment status from {from} to {to}.",
        };
    }

    private static PaymentDto Map(Payment p) =>
        new(
            p.Id,
            p.ReservationId,
            p.Amount,
            p.Currency,
            p.Status.ToString(),
            p.Label,
            p.InternalNotes,
            p.PaidAtUtc,
            p.FailedAtUtc,
            p.RefundedAtUtc,
            p.ExternalPaymentId,
            p.ExternalCheckoutSessionId,
            p.Provider,
            p.CreatedAtUtc,
            p.UpdatedAtUtc);
}
