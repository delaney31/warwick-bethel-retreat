namespace PacificLuxe.Api.Features.Auth;

public interface IAdminAuthService
{
    Task<AdminLoginResponse?> LoginAsync(string email, string password, CancellationToken ct = default);
}
