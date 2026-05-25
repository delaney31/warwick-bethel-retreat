using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Entities;

/// <summary>
/// Persisted agreement lifecycle for a reservation. Replace with e-sign provider metadata later.
/// </summary>
public class SignedAgreement : BaseEntity
{
    public Guid ReservationId { get; set; }

    public AgreementStatus Status { get; set; } = AgreementStatus.NotSent;

    public DateTime? SentAtUtc { get; set; }
    public DateTime? SignedAtUtc { get; set; }

    /// <summary>Optional template or version label for future PDF/template swaps.</summary>
    public string? TemplateKey { get; set; }

    /// <summary>Reserved for DocuSign / HelloSign envelope id.</summary>
    public string? ExternalProviderId { get; set; }

    public Reservation Reservation { get; set; } = null!;
}
