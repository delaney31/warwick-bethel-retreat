using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Auth;

[ApiController]
[Route("api/admin/auth")]
[AllowAnonymous]
public class AdminAuthController : ControllerBase
{
    private readonly IAdminAuthService _auth;

    public AdminAuthController(IAdminAuthService auth)
    {
        _auth = auth;
    }

    /// <summary>
    /// Exchange email + password for a JWT bearer token (admin UI only).
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AdminLoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] AdminLoginRequest request, CancellationToken ct = default)
    {
        var response = await _auth.LoginAsync(request.Email, request.Password, ct);
        if (response == null)
        {
            return Problem(
                title: "Unauthorized",
                detail: "Invalid email or password.",
                statusCode: StatusCodes.Status401Unauthorized);
        }

        return Ok(response);
    }
}
