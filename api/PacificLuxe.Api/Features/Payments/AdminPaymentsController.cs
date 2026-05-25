using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Payments;

[ApiController]
[Route("api/admin/payments")]
[Authorize(Roles = "Admin")]
public class AdminPaymentsController : ControllerBase
{
    private readonly IPaymentService _payments;

    public AdminPaymentsController(IPaymentService payments)
    {
        _payments = payments;
    }

    /// <summary>
    /// Update payment status (admin or future webhook processor). Marking Paid moves AwaitingPayment reservations to Confirmed.
    /// </summary>
    [HttpPatch("{paymentId:guid}/status")]
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdateStatus(
        Guid paymentId,
        [FromBody] UpdatePaymentStatusRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _payments.UpdateStatusAsync(paymentId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }
}
