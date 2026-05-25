using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Features.Vehicles;

public static class VehicleMapping
{
    public static VehicleSummaryDto ToSummaryDto(this Vehicle v) =>
        new(
            v.Id,
            v.Slug,
            v.DisplayName,
            v.Year,
            v.Make,
            v.Model,
            v.DailyRate,
            v.IncludedMilesPerDay,
            v.LocationCity,
            v.Status.ToString(),
            v.HeroImage);

    public static VehicleDetailDto ToDetailDto(this Vehicle v) =>
        new(
            v.Id,
            v.Slug,
            v.DisplayName,
            v.Year,
            v.Make,
            v.Model,
            v.Trim,
            v.DailyRate,
            v.IncludedMilesPerDay,
            v.LocationCity,
            v.Status.ToString(),
            v.Description,
            v.HeroImage);
}
