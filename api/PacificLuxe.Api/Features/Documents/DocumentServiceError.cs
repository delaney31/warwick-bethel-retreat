namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Maps to <see cref="Microsoft.AspNetCore.Mvc.ControllerBase.Problem"/> in controllers.
/// </summary>
public record DocumentServiceError(int StatusCode, string Title, string Detail);
