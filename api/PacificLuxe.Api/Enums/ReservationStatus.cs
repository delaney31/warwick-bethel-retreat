namespace PacificLuxe.Api.Enums;

/// <summary>
/// Reservation lifecycle status. See RESERVATION_LIFECYCLE.md for transitions.
/// </summary>
public enum ReservationStatus
{
    PendingReview = 0,
    Approved = 1,
    DocumentsSubmitted = 2,
    DocumentsApproved = 3,
    /// <summary>Agreement sent to renter; awaiting signature (placeholder flow).</summary>
    AgreementSent = 4,
    /// <summary>Deprecated path: use <see cref="AwaitingPayment"/> after placeholder sign-off. Kept for transitions / reporting.</summary>
    AgreementSigned = 5,
    /// <summary>Agreement marked signed; awaiting payment before confirmation.</summary>
    AwaitingPayment = 6,
    Confirmed = 7,
    Active = 8,
    Returned = 9,
    Completed = 10,
    Rejected = 11,
    Cancelled = 12,
}
