using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Reservations;

[ApiController]
[Route("api/admin/reservations")]
[Authorize(Roles = "Admin")]
public class AdminReservationsController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public AdminReservationsController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    /// <summary>
    /// List reservations (admin). Supports filtering by status.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ReservationSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReservationSummaryDto>>> GetReservations(
        [FromQuery] ReservationStatus? status,
        CancellationToken ct = default)
    {
        var reservations = await _reservationService.GetReservationsAsync(status, ct);
        return Ok(reservations);
    }

    /// <summary>
    /// Get a reservation by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ReservationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReservationDetailDto>> GetById(Guid id, CancellationToken ct = default)
    {
        var reservation = await _reservationService.GetReservationByIdAsync(id, ct);
        if (reservation == null)
            return NotFound();

        return Ok(reservation);
    }

    /// <summary>
    /// Update reservation status. Enforces lifecycle rules from RESERVATION_LIFECYCLE.md.
    /// Supports: approve, reject, request verification (docs rejected), approve documents, cancel, etc.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateReservationStatusRequest request,
        CancellationToken ct = default)
    {
        var (success, error) = await _reservationService.UpdateReservationStatusAsync(id, request, ct);

        if (error == "Reservation not found.")
            return NotFound(new { error });

        if (error != null)
            return BadRequest(new { error });

        return NoContent();
    }
}
