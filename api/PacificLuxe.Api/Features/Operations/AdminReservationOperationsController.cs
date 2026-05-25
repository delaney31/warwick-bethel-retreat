using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Operations;

[ApiController]
[Route("api/admin/reservations/{reservationId:guid}")]
[Authorize(Roles = "Admin")]
public class AdminReservationOperationsController : ControllerBase
{
    private readonly IOperationsService _operations;

    public AdminReservationOperationsController(IOperationsService operations)
    {
        _operations = operations;
    }

    /// <summary>Record pickup (odometer/fuel/charge out, notes). Confirmed → Active on first pickup.</summary>
    [HttpPost("pickup")]
    [ProducesResponseType(typeof(PickupChecklistDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RecordPickup(
        Guid reservationId,
        [FromBody] RecordPickupRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _operations.RecordPickupAsync(reservationId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return Ok(dto);
    }

    /// <summary>Record return (odometer/fuel/charge in, notes). Active → Returned on first return.</summary>
    [HttpPost("return")]
    [ProducesResponseType(typeof(ReturnChecklistDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RecordReturn(
        Guid reservationId,
        [FromBody] RecordReturnRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _operations.RecordReturnAsync(reservationId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return Ok(dto);
    }

    /// <summary>Add an additional charge line (Active or Returned only).</summary>
    [HttpPost("charges")]
    [ProducesResponseType(typeof(AdditionalChargeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateCharge(
        Guid reservationId,
        [FromBody] CreateAdditionalChargeRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _operations.CreateChargeAsync(reservationId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return Ok(dto);
    }

    /// <summary>Pickup, return, and charges snapshot for reconciliation.</summary>
    [HttpGet("operations")]
    [ProducesResponseType(typeof(ReservationOperationsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOperations(Guid reservationId, CancellationToken ct = default)
    {
        var (dto, error) = await _operations.GetOperationsAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return Ok(dto);
    }

    /// <summary>Mark rental complete after vehicle return (Returned → Completed).</summary>
    [HttpPost("complete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CompleteReservation(Guid reservationId, CancellationToken ct = default)
    {
        var (success, error) = await _operations.CompleteReservationAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return NoContent();
    }
}
