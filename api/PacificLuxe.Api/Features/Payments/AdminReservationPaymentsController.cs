using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Payments;

[ApiController]
[Route("api/admin/reservations/{reservationId:guid}/payments")]
[Authorize(Roles = "Admin")]
public class AdminReservationPaymentsController : ControllerBase
{
    private readonly IPaymentService _payments;

    public AdminReservationPaymentsController(IPaymentService payments)
    {
        _payments = payments;
    }

    /// <summary>
    /// Create a payment record (e.g. amount due). Status starts as Pending — replace with Stripe Checkout session creation later.
    /// </summary>
    [HttpPost("create")]
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(
        Guid reservationId,
        [FromBody] CreatePaymentRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _payments.CreateAsync(reservationId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PaymentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> List(Guid reservationId, CancellationToken ct = default)
    {
        var (list, error) = await _payments.ListForReservationAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(list);
    }
}
