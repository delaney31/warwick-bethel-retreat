namespace PacificLuxe.Api.Features.Payments;

public record PaymentServiceError(int StatusCode, string Title, string Detail);
