namespace PacificLuxe.Api.Features.Availability;

// ─── Response DTOs ─────────────────────────────────────────

public record AvailabilityBlockDto(
    Guid Id,
    Guid VehicleId,
    DateOnly StartDateUtc,
    DateOnly EndDateUtc,
    string Reason,
    string? Notes,
    DateTime CreatedAtUtc);

public record VehicleAvailabilityDto(
    Guid VehicleId,
    DateOnly? FromDate,
    DateOnly? ToDate,
    IReadOnlyList<AvailabilityBlockDto> Blocks,
    IReadOnlyList<DateRangeDto> BlockedRanges);

public record DateRangeDto(DateOnly Start, DateOnly End);

public record AvailabilityCheckDto(
    Guid VehicleId,
    DateOnly StartDate,
    DateOnly EndDate,
    bool IsAvailable,
    string? Reason);

// ─── Request DTOs ─────────────────────────────────────────

public record CreateAvailabilityBlockRequest(
    Guid VehicleId,
    DateOnly StartDateUtc,
    DateOnly EndDateUtc,
    string Reason,
    string? Notes);
