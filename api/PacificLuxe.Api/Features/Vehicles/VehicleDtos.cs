using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Vehicles;

// ─── Response DTOs ─────────────────────────────────────────

public record VehicleSummaryDto(
    Guid Id,
    string Slug,
    string DisplayName,
    int Year,
    string Make,
    string Model,
    decimal DailyRate,
    int IncludedMilesPerDay,
    string LocationCity,
    string Status,
    string? HeroImage);

public record VehicleDetailDto(
    Guid Id,
    string Slug,
    string DisplayName,
    int Year,
    string Make,
    string Model,
    string? Trim,
    decimal DailyRate,
    int IncludedMilesPerDay,
    string LocationCity,
    string Status,
    string Description,
    string? HeroImage);

// ─── Request DTOs ─────────────────────────────────────────

public record CreateVehicleRequest(
    string Slug,
    string DisplayName,
    int Year,
    string Make,
    string Model,
    string? Trim,
    decimal DailyRate,
    int IncludedMilesPerDay,
    string LocationCity,
    VehicleStatus Status,
    string Description,
    string? HeroImage);

public record UpdateVehicleRequest(
    string? Slug,
    string? DisplayName,
    int? Year,
    string? Make,
    string? Model,
    string? Trim,
    decimal? DailyRate,
    int? IncludedMilesPerDay,
    string? LocationCity,
    VehicleStatus? Status,
    string? Description,
    string? HeroImage);
