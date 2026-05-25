using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Entities;

/// <summary>
/// A payment attempt or charge for a reservation (placeholder until Stripe).
/// </summary>
public class Payment : BaseEntity
{
    public Guid ReservationId { get; set; }

    /// <summary>Total amount in major currency units (e.g. USD dollars).</summary>
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "USD";

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    /// <summary>Short label shown in admin (e.g. Rental total).</summary>
    public string? Label { get; set; }

    /// <summary>Internal admin notes.</summary>
    public string? InternalNotes { get; set; }

    public DateTime? PaidAtUtc { get; set; }
    public DateTime? FailedAtUtc { get; set; }
    public DateTime? RefundedAtUtc { get; set; }

    /// <summary>Stripe PaymentIntent id or equivalent.</summary>
    public string? ExternalPaymentId { get; set; }

    /// <summary>Stripe Checkout Session id or equivalent.</summary>
    public string? ExternalCheckoutSessionId { get; set; }

    /// <summary>Provider name for future multi-provider support (e.g. Stripe).</summary>
    public string? Provider { get; set; }

    public Reservation Reservation { get; set; } = null!;
}
