using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Agreements;

[ApiController]
[Route("api/admin/reservations/{reservationId:guid}/agreement")]
[Authorize(Roles = "Admin")]
public class AdminReservationAgreementController : ControllerBase
{
    private readonly IAgreementService _agreements;

    public AdminReservationAgreementController(IAgreementService agreements)
    {
        _agreements = agreements;
    }

    /// <summary>
    /// Placeholder: mark agreement as sent to renter. Moves reservation to AgreementSent when Approved or DocumentsApproved.
    /// </summary>
    [HttpPost("send")]
    [ProducesResponseType(typeof(AgreementStateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Send(Guid reservationId, CancellationToken ct = default)
    {
        var (dto, error) = await _agreements.SendAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }

    /// <summary>
    /// Placeholder: mark agreement as signed (e.g. after in-person or future e-sign). Moves reservation to AwaitingPayment.
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
