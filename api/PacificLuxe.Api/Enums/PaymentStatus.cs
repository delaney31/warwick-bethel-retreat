namespace PacificLuxe.Api.Enums;

/// <summary>
/// Payment record lifecycle. Replace/extend when wiring Stripe Checkout and webhooks.
/// </summary>
public enum PaymentStatus
{
    NotRequested = 0,
    Pending = 1,
    Paid = 2,
    Failed = 3,
    Refunded = 4,
}
