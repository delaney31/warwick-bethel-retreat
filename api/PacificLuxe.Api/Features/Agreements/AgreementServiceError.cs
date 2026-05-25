namespace PacificLuxe.Api.Features.Agreements;

public record AgreementServiceError(int StatusCode, string Title, string Detail);
