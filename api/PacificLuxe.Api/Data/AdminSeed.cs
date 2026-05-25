using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data;

/// <summary>
/// Ensures an admin exists when <see cref="AdminSeedOptions"/> Email/Password are set.
/// Local dev uses <c>appsettings.Development.json</c>; PostgreSQL (e.g. Render) uses env <c>AdminSeed__Email</c> / <c>AdminSeed__Password</c>.
/// Skips if that email already exists or email/password are missing.
/// </summary>
public static class AdminSeed
{
    public static async Task SeedAsync(
        AppDbContext db,
        IConfiguration configuration,
        PasswordHasher<AdminUser> passwordHasher,
        ILogger logger,
        CancellationToken ct = default)
    {
        var section = configuration.GetSection(AdminSeedOptions.SectionName);
        var email = section["Email"];
        var password = section["Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            if (await db.AdminUsers.AnyAsync(ct))
                return;

            logger.LogWarning(
                "No admin users exist and {Section}:Email/Password are not set. Configure admin seed or create a user manually.",
                AdminSeedOptions.SectionName);
            return;
        }

        var normalized = email.Trim().ToUpperInvariant();
        if (await db.AdminUsers.AnyAsync(u => u.NormalizedEmail == normalized, ct))
            return;

        var now = DateTime.UtcNow;
        var user = new AdminUser
        {
            Id = Guid.NewGuid(),
            Email = email.Trim(),
            NormalizedEmail = normalized,
            PasswordHash = passwordHasher.HashPassword(new AdminUser(), password),
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        };

        db.AdminUsers.Add(user);
        await db.SaveChangesAsync(ct);
        logger.LogInformation("Seeded admin user {Email}.", user.Email);
    }
}

public class AdminSeedOptions
{
    public const string SectionName = "AdminSeed";
}
