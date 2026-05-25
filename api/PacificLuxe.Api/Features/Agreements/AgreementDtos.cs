namespace PacificLuxe.Api.Features.Agreements;

/// <summary>Public + admin read model for agreement placeholder state.</summary>
public record AgreementStateDto(
    Guid ReservationId,
    string ReservationStatus,
    string AgreementStatus,
    DateTime? SentAtUtc,
    DateTime? SignedAtUtc,
    string? TemplateKey,
    string? ExternalProviderId,
    string ProviderPlaceholder);
