using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Features.Auth;

public interface IJwtTokenService
{
    string CreateToken(AdminUser user);
}
