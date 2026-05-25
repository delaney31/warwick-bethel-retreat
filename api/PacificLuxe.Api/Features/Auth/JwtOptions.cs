namespace PacificLuxe.Api.Features.Auth;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "PacificLuxeDirect";
    public string Audience { get; set; } = "PacificLuxeAdmin";
    /// <summary>Symmetric key for HS256 — must be at least 32 bytes for production.</summary>
    public string SigningKey { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 480;
}
