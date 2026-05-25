using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Data;

/// <summary>
/// Ensures every reservation has a <see cref="SignedAgreement"/> row (for DBs created before this feature).
/// </summary>
public static class SignedAgreementBackfill
{
    /// <summary>
    /// Runs <see cref="RunAsync"/> but never throws — logs and returns if the schema is missing or another error occurs.
    /// Use after migrations so the <c>reservations</c> table exists (e.g. Neon / Render Postgres).
    /// </summary>
    public static async Task TryRunAsync(AppDbContext db, ILogger logger, CancellationToken ct = default)
    {
        try
        {
            await RunAsync(db, logger, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "SignedAgreementBackfill skipped (schema not ready or unexpected error).");
        }
    }

    public static async Task RunAsync(AppDbContext db, ILogger logger, CancellationToken ct = default)
    {
        var missingIds = await db.Reservations
            .AsNoTracking()
            .Where(r => !db.SignedAgreements.Any(sa => sa.ReservationId == r.Id))
            .Select(r => r.Id)
            .ToListAsync(ct);

        if (missingIds.Count == 0)
            return;

        foreach (var id in missingIds)
        {
            db.SignedAgreements.Add(new SignedAgreement
            {
                ReservationId = id,
                Status = AgreementStatus.NotSent,
            });
        }

        await db.SaveChangesAsync(ct);
        logger.LogInformation("Backfilled {Count} signed_agreement row(s).", missingIds.Count);
    }
}
