using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Agreements;

/// <summary>
/// Renter-facing agreement state (placeholder until e-sign).
/// </summary>
[ApiController]
[Route("api/reservations/{reservationId:guid}/agreement")]
[AllowAnonymous]
public class ReservationAgreementController : ControllerBase
{
    private readonly IAgreementService _agreements;

    public ReservationAgreementController(IAgreementService agreements)
    {
        _agreements = agreements;
    }

    [HttpGet]
    [ProducesResponseType(typeof(AgreementStateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid reservationId, CancellationToken ct = default)
    {
        var (dto, error) = await _agreements.GetPublicAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }

    /// <summary>
    /// Renter placeholder: mark agreement signed (same as admin mark-signed). Replace with e-sign webhook later.
    /// </summary>
    [HttpPost("mark-signed")]
    [ProducesResponseType(typeof(AgreementStateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> MarkSigned(Guid reservationId, CancellationToken ct = default)
    {
        var (dto, error) = await _agreements.MarkSignedAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }
}
