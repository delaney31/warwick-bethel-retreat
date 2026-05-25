namespace PacificLuxe.Api.Entities;

/// <summary>
/// Back-office operator (single-owner MVP). Password is stored as ASP.NET Identity v3 hash.
/// </summary>
public class AdminUser : BaseEntity
{
    public string Email { get; set; } = string.Empty;

    /// <summary>Uppercase normalized email for lookups.</summary>
    public string NormalizedEmail { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;
}
