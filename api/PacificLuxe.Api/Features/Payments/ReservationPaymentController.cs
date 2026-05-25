using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Payments;

/// <summary>
/// Renter-facing payment summary (no internal notes).
/// </summary>
[ApiController]
[Route("api/reservations/{reservationId:guid}/payment")]
[AllowAnonymous]
public class ReservationPaymentController : ControllerBase
{
    private readonly IPaymentService _payments;

    public ReservationPaymentController(IPaymentService payments)
    {
        _payments = payments;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PaymentPublicDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid reservationId, CancellationToken ct = default)
    {
        var (dto, error) = await _payments.GetPublicAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }
}
