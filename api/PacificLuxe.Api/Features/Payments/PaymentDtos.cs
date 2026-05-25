using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Payments;

public record CreatePaymentRequest(
    decimal Amount,
    string? Currency,
    string? Label,
    string? InternalNotes);

public record UpdatePaymentStatusRequest(
    PaymentStatus Status,
    string? InternalNotes);

public record PaymentDto(
    Guid Id,
    Guid ReservationId,
    decimal Amount,
    string Currency,
    string Status,
    string? Label,
    string? InternalNotes,
    DateTime? PaidAtUtc,
    DateTime? FailedAtUtc,
    DateTime? RefundedAtUtc,
    string? ExternalPaymentId,
    string? ExternalCheckoutSessionId,
    string? Provider,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc);

/// <summary>Renter-safe payment summary (latest relevant row or NotRequested).</summary>
public record PaymentPublicDto(
    Guid ReservationId,
    string ReservationStatus,
    string PaymentStatus,
    decimal? Amount,
    string Currency,
    DateTime? PaidAtUtc,
    string? Label);
