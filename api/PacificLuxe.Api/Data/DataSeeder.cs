using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PacificLuxe.Api.Configuration;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Data;

/// <summary>
/// Inserts the Pacific Luxe rental inventory when missing.
/// Disable via <c>SeedFleet: false</c> (or omit) if you load inventory only from another pipeline.
/// </summary>
public static class DataSeeder
{
    /// <summary>
    /// Inserts the full fleet catalog when <c>vehicles</c> has no rows, then ensures any new catalog
    /// entries exist by slug (safe for production DBs that already have vehicles).
    /// </summary>
    public static async Task SeedIfEmptyAsync(
        AppDbContext db,
        IHostEnvironment env,
        IConfiguration config,
        ILogger logger,
        CancellationToken ct = default)
    {
        var productLine = config.GetSection(ProductLineOptions.SectionName).Get<ProductLineOptions>();
        if (productLine?.IsRetreat == true)
        {
            logger.LogDebug("Fleet seed skipped (ProductLine=Retreat).");
            return;
        }

        if (!await db.Vehicles.AnyAsync(ct))
        {
            if (!IsSeedingAllowed(env, config))
            {
                logger.LogInformation(
                    "Fleet seed skipped: empty vehicles table, but seeding is disabled. " +
                    "For staging/dev, set ASPNETCORE_ENVIRONMENT=Staging, or SeedFleet=true / SEED_FLEET=true.");
            }
            else
            {
                var now = DateTime.UtcNow;
                var vehicles = CreateFleetCatalog(now);
                db.Vehicles.AddRange(vehicles);
                await db.SaveChangesAsync(ct);
                logger.LogInformation("Fleet seed complete: inserted {Count} vehicles.", vehicles.Count);
            }
        }

        await EnsureFleetCatalogAsync(db, logger, config, ct);
    }

    /// <summary>
    /// Inserts any catalog vehicle whose slug is not already in the database.
    /// </summary>
    public static async Task EnsureFleetCatalogAsync(
        AppDbContext db,
        ILogger logger,
        IConfiguration config,
        CancellationToken ct = default)
    {
        var productLine = config.GetSection(ProductLineOptions.SectionName).Get<ProductLineOptions>();
        if (productLine?.IsRetreat == true)
            return;

        var existingSlugs = await db.Vehicles
            .AsNoTracking()
            .Select(v => v.Slug)
            .ToListAsync(ct);

        var existing = existingSlugs.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var now = DateTime.UtcNow;
        var missing = CreateFleetCatalog(now)
            .Where(v => !existing.Contains(v.Slug))
            .ToList();

        if (missing.Count == 0)
        {
            logger.LogDebug("Fleet catalog sync: all vehicles present.");
            return;
        }

        db.Vehicles.AddRange(missing);
        await db.SaveChangesAsync(ct);
        logger.LogInformation(
            "Fleet catalog sync: inserted {Count} vehicle(s): {Slugs}",
            missing.Count,
            string.Join(", ", missing.Select(v => v.Slug)));
    }

    private static bool IsSeedingAllowed(IHostEnvironment env, IConfiguration config) =>
        env.IsDevelopment()
        || string.Equals(env.EnvironmentName, "Staging", StringComparison.OrdinalIgnoreCase)
        || config.GetValue("SeedFleet", false)
        || string.Equals(
            Environment.GetEnvironmentVariable("SEED_FLEET"),
            "true",
            StringComparison.OrdinalIgnoreCase);

    private static List<Vehicle> CreateFleetCatalog(DateTime now) =>
    [
        new()
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111101"),
            Slug = "porsche-911-turbo-s-cabriolet",
            DisplayName = "2022 Porsche 911 Turbo S Cabriolet",
            Year = 2022,
            Make = "Porsche",
            Model = "911 Turbo S Cabriolet",
            Trim = null,
            DailyRate = 995,
            IncludedMilesPerDay = 100,
            LocationCity = "Santa Monica, CA",
            Status = VehicleStatus.Available,
            Description =
                "A high-spec Porsche 911 Turbo S Cabriolet positioned as the flagship of the Pacific Luxe fleet. Ideal for premium coastal drives, special occasions, and luxury performance rentals in Los Angeles.",
            HeroImage = "/images/vehicles/911-turbo-s/99AD7FB9-203B-4A52-9E30-CB6918657AB4.png",
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        },
        new()
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111102"),
            Slug = "porsche-911-carrera-s-cabriolet",
            DisplayName = "2015 Porsche 911 Carrera S",
            Year = 2015,
            Make = "Porsche",
            Model = "911 Carrera S",
            Trim = null,
            DailyRate = 495,
            IncludedMilesPerDay = 100,
            LocationCity = "Santa Monica, CA",
            Status = VehicleStatus.Available,
            Description =
                "A stylish 911 Carrera S coupe that delivers the iconic Porsche driving experience with strong everyday usability and excellent Los Angeles rental appeal.",
            HeroImage = "/images/vehicles/911-carrera-s/E7E00BCC-8519-4B86-B293-5A7201D81A59.png",
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        },
        new()
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111103"),
            Slug = "porsche-718-cayman-manual",
            DisplayName = "2018 Porsche 718 Cayman Manual",
            Year = 2018,
            Make = "Porsche",
            Model = "718 Cayman",
            Trim = "Manual",
            DailyRate = 325,
            IncludedMilesPerDay = 100,
            LocationCity = "Santa Monica, CA",
            Status = VehicleStatus.Available,
            Description =
                "A driver-focused 718 Cayman with a manual transmission, positioned as the analog enthusiast option in the fleet and an approachable Porsche entry point.",
            HeroImage = "/images/vehicles/718-cayman/0EDD415A-F79F-4520-9D65-1B0D84C1109C.png",
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        },
        new()
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111104"),
            Slug = "porsche-cayman-gt4",
            DisplayName = "2016 Porsche Cayman GT4",
            Year = 2016,
            Make = "Porsche",
            Model = "Cayman GT4",
            Trim = null,
            DailyRate = 695,
            IncludedMilesPerDay = 100,
            LocationCity = "Santa Monica, CA",
            Status = VehicleStatus.Offline,
            Description =
                "A special-driver Porsche Cayman GT4 positioned as the enthusiast halo car in the fleet. " +
                "Currently offline pending registration/tax-related readiness — visible on the fleet but not bookable.",
            HeroImage = "/images/vehicles/cayman-gt4/sideshot.png",
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        },
        new()
        {
            Id = Guid.Parse("a1111111-1111-1111-1111-111111111105"),
            Slug = "bmw-x7-xdrive40i",
            DisplayName = "2023 BMW X7 xDrive40i",
            Year = 2023,
            Make = "BMW",
            Model = "X7 xDrive40i",
            Trim = null,
            DailyRate = 595,
            IncludedMilesPerDay = 100,
            LocationCity = "Santa Monica, CA",
            Status = VehicleStatus.Available,
            Description =
                "A full-size luxury SUV with six-passenger captain's chair seating, BMW xDrive all-wheel drive, and a refined cabin with the latest curved display and premium materials. Ideal for families, group trips, and clients who want SUV space with first-class comfort in Los Angeles.",
            HeroImage = "/images/vehicles/bmw-x7-xdrive40i/hero.png",
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        },
    ];
}
