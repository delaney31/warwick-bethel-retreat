using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Operations;

// ─── Requests ─────────────────────────────────────────────

public record RecordPickupRequest(
    int OdometerOut,
    int FuelOrChargeOutPercent,
    string? ConditionNotes,
    string CompletedBy);

public record RecordReturnRequest(
    int OdometerIn,
    int FuelOrChargeInPercent,
    string? ConditionNotes,
    string CompletedBy);

public record CreateAdditionalChargeRequest(
    AdditionalChargeType Type,
    decimal Amount,
    string? Currency,
    string? Notes);

public record UpdateAdditionalChargeRequest(
    AdditionalChargeType? Type,
    decimal? Amount,
    string? Currency,
    string? Notes);

// ─── Responses ────────────────────────────────────────────

public record PickupChecklistDto(
    Guid Id,
    int OdometerOut,
    int FuelOrChargeOutPercent,
    string? ConditionNotes,
    DateTime CompletedAtUtc,
    string CompletedBy);

public record ReturnChecklistDto(
    Guid Id,
    int OdometerIn,
    int FuelOrChargeInPercent,
    string? ConditionNotes,
    DateTime CompletedAtUtc,
    string CompletedBy);

public record AdditionalChargeDto(
    Guid Id,
    Guid ReservationId,
    AdditionalChargeType Type,
    decimal Amount,
    string Currency,
    string? Notes,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc);

public record ReservationOperationsDto(
    Guid ReservationId,
    string ReservationStatus,
    PickupChecklistDto? Pickup,
    ReturnChecklistDto? Return,
    IReadOnlyList<AdditionalChargeDto> AdditionalCharges);
