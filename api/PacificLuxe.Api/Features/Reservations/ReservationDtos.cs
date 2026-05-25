using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Reservations;

// ─── Request DTOs ─────────────────────────────────────────

public record CreateReservationRequest(
    Guid VehicleId,
    string RenterName,
    string RenterEmail,
    string RenterPhone,
    DateOnly StartDate,
    DateOnly EndDate,
    PickupPreference PickupPreference,
    int DriverAge,
    string? Notes);

public record UpdateReservationStatusRequest(
    ReservationStatus Status,
    string? Message = null);

// ─── Response DTOs ───────────────────────────────────────

public record ReservationCreatedDto(Guid Id, string Status);

public record ReservationSummaryDto(
    Guid Id,
    Guid VehicleId,
    string VehicleDisplayName,
    string Status,
    string RenterName,
    string RenterEmail,
    string RenterPhone,
    DateOnly StartDate,
    DateOnly EndDate,
    string PickupPreference,
    int DriverAge,
    string Notes,
    int RentalDays,
    decimal DailyRateAtBooking,
    decimal Subtotal,
    DateTime CreatedAtUtc);

public record ReservationDetailDto(
    Guid Id,
    Guid VehicleId,
    string VehicleDisplayName,
    string Status,
    string RenterName,
    string RenterEmail,
    string RenterPhone,
    DateOnly StartDate,
    DateOnly EndDate,
    string PickupPreference,
    int DriverAge,
    string Notes,
    DateTime CreatedAtUtc);
