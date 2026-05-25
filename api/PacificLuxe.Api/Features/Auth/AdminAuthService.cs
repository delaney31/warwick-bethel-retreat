using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Features.Auth;

public sealed class AdminAuthService : IAdminAuthService
{
    private readonly AppDbContext _db;
    private readonly PasswordHasher<AdminUser> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtOptions _jwtOptions;

    public AdminAuthService(
        AppDbContext db,
        PasswordHasher<AdminUser> passwordHasher,
        IJwtTokenService jwtTokenService,
        IOptions<JwtOptions> jwtOptions)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _jwtOptions = jwtOptions.Value;
    }

    public async Task<AdminLoginResponse?> LoginAsync(string email, string password, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return null;

        var normalized = NormalizeEmail(email);
        var user = await _db.AdminUsers.AsNoTracking()
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalized, ct);

        if (user == null)
            return null;

        PasswordVerificationResult result;
        try
        {
            result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        }
        catch (FormatException)
        {
            // Malformed hash (e.g. manual SQL insert with plain text). Treat as failed login; do not 500.
            return null;
        }

        if (result is not PasswordVerificationResult.Success and not PasswordVerificationResult.SuccessRehashNeeded)
            return null;

        // If rehash needed, upgrade hash on next successful login (tracked)
        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            var tracked = await _db.AdminUsers.FirstAsync(u => u.Id == user.Id, ct);
            tracked.PasswordHash = _passwordHasher.HashPassword(tracked, password);
            await _db.SaveChangesAsync(ct);
        }

        var token = _jwtTokenService.CreateToken(user);
        return new AdminLoginResponse(
            AccessToken: token,
            TokenType: "Bearer",
            ExpiresInSeconds: _jwtOptions.ExpirationMinutes * 60);
    }

    private static string NormalizeEmail(string email) => email.Trim().ToUpperInvariant();
}
