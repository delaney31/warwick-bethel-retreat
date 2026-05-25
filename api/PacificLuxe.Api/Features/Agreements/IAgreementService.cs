namespace PacificLuxe.Api.Features.Agreements;

public interface IAgreementService
{
    Task<(AgreementStateDto? Dto, AgreementServiceError? Error)> GetPublicAsync(Guid reservationId, CancellationToken ct = default);

    Task<(AgreementStateDto? Dto, AgreementServiceError? Error)> SendAsync(Guid reservationId, CancellationToken ct = default);

    Task<(AgreementStateDto? Dto, AgreementServiceError? Error)> MarkSignedAsync(Guid reservationId, CancellationToken ct = default);
}
