using Microsoft.EntityFrameworkCore;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Agreements;

public sealed class AgreementService : IAgreementService
{
    private readonly AppDbContext _db;

    public AgreementService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(AgreementStateDto? Dto, AgreementServiceError? Error)> GetPublicAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations
            .Include(r => r.Agreement)
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, new AgreementServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        await EnsureAgreementExistsAsync(reservation, ct);

        return (Map(reservation), null);
    }

    public async Task<(AgreementStateDto? Dto, AgreementServiceError? Error)> SendAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations
            .Include(r => r.Agreement)
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, new AgreementServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        await EnsureAgreementExistsAsync(reservation, ct);

        if (reservation.Agreement!.Status is AgreementStatus.Sent or AgreementStatus.Signed)
            return (null, new AgreementServiceError(
                StatusCodes.Status409Conflict,
                "Conflict",
                "Agreement has already been sent or signed."));

        if (!CanSendAgreement(reservation.Status))
            return (null, new AgreementServiceError(
                StatusCodes.Status409Conflict,
                "Conflict",
                "Agreement can only be sent when the reservation is Approved or DocumentsApproved."));

        var now = DateTime.UtcNow;
        reservation.Agreement.Status = AgreementStatus.Sent;
        reservation.Agreement.SentAtUtc = now;
        reservation.Agreement.TemplateKey ??= "mvp-placeholder-v1";
        reservation.Status = ReservationStatus.AgreementSent;

        await _db.SaveChangesAsync(ct);

        return (Map(reservation), null);
    }

    public async Task<(AgreementStateDto? Dto, AgreementServiceError? Error)> MarkSignedAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations
            .Include(r => r.Agreement)
            .FirstOrDefaultAsync(r => r.Id == reservationId, ct);

        if (reservation == null)
            return (null, new AgreementServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        await EnsureAgreementExistsAsync(reservation, ct);

        if (reservation.Agreement!.Status != AgreementStatus.Sent)
            return (null, new AgreementServiceError(
                StatusCodes.Status409Conflict,
                "Conflict",
                "Agreement must be in Sent status before it can be marked signed."));

        if (reservation.Status != ReservationStatus.AgreementSent)
            return (null, new AgreementServiceError(
                StatusCodes.Status409Conflict,
                "Conflict",
                "Reservation must be in AgreementSent status to mark the agreement signed."));

        var now = DateTime.UtcNow;
        reservation.Agreement.Status = AgreementStatus.Signed;
        reservation.Agreement.SignedAtUtc = now;
        reservation.Status = ReservationStatus.AwaitingPayment;

        await _db.SaveChangesAsync(ct);

        return (Map(reservation), null);
    }

    private static bool CanSendAgreement(ReservationStatus s) =>
        s is ReservationStatus.Approved or ReservationStatus.DocumentsApproved;

    private async Task EnsureAgreementExistsAsync(Reservation reservation, CancellationToken ct)
    {
        if (reservation.Agreement != null)
            return;

        var agreement = new SignedAgreement
        {
            ReservationId = reservation.Id,
            Status = AgreementStatus.NotSent,
        };
        reservation.Agreement = agreement;
        _db.SignedAgreements.Add(agreement);
        await _db.SaveChangesAsync(ct);
    }

    private static AgreementStateDto Map(Reservation r)
    {
        var a = r.Agreement ?? throw new InvalidOperationException("Agreement row is required.");
        return new AgreementStateDto(
            r.Id,
            r.Status.ToString(),
            a.Status.ToString(),
            a.SentAtUtc,
            a.SignedAtUtc,
            a.TemplateKey,
            a.ExternalProviderId,
            ProviderPlaceholder: "none");
    }
}
