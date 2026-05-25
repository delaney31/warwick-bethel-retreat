using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Data;

/// <summary>
/// Seeds the single Warwick Bethel Retreat listing when ProductLine is Retreat.
/// </summary>
public static class RetreatDataSeeder
{
    public static readonly Guid WarwickVehicleId = Guid.Parse("b1111111-1111-1111-1111-111111111101");
    public const string WarwickSlug = "warwick-bethel-retreat";

    public static async Task SeedIfEmptyAsync(
        AppDbContext db,
        IHostEnvironment env,
        IConfiguration config,
        ILogger logger,
        CancellationToken ct = default)
    {
        if (!IsSeedingAllowed(env, config))
        {
            logger.LogInformation("Retreat property seed skipped (seeding disabled).");
            return;
        }

        var exists = await db.Vehicles.AnyAsync(v => v.Slug == WarwickSlug, ct);
        if (exists)
        {
            logger.LogDebug("Retreat property already seeded.");
            return;
        }

        var now = DateTime.UtcNow;
        db.Vehicles.Add(new Vehicle
        {
            Id = WarwickVehicleId,
            Slug = WarwickSlug,
            DisplayName = "Warwick Bethel Retreat",
            Year = 2024,
            Make = "Warwick",
            Model = "Luxury Cottage",
            Trim = "2 Bed · 1.5 Bath",
            DailyRate = 150,
            IncludedMilesPerDay = 0,
            LocationCity = "Warwick, NY",
            Status = VehicleStatus.Available,
            Description =
                "A high-class nightly stay fifteen minutes from Warwick Bethel. Vaulted ceilings, hardwood floors, wooded deck, and warm minimal interiors.",
            HeroImage = "/images/property/hero.jpg",
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        });

        await db.SaveChangesAsync(ct);
        logger.LogInformation("Retreat property seed complete: {Slug}", WarwickSlug);
    }

    private static bool IsSeedingAllowed(IHostEnvironment env, IConfiguration config) =>
        env.IsDevelopment()
        || string.Equals(env.EnvironmentName, "Staging", StringComparison.OrdinalIgnoreCase)
        || config.GetValue("SeedRetreat", true)
        || string.Equals(
            Environment.GetEnvironmentVariable("SEED_RETREAT"),
            "true",
            StringComparison.OrdinalIgnoreCase);
}
