namespace PacificLuxe.Api.Features.Auth;

public record AdminLoginRequest(string Email, string Password);

public record AdminLoginResponse(
    string AccessToken,
    string TokenType,
    int ExpiresInSeconds);
