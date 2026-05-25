using Microsoft.AspNetCore.Mvc;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Reservations;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationsController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    /// <summary>
    /// Submit a booking request (public). Creates reservation with PendingReview status.
    /// Validates vehicle availability and date range.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ReservationCreatedDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReservationCreatedDto>> Create(
        [FromBody] CreateReservationRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _reservationService.CreateReservationAsync(request, ct);

        if (error == "Vehicle not found.")
            return NotFound(new { error });

        if (error != null)
            return BadRequest(new { error });

        return CreatedAtAction(
            nameof(AdminReservationsController.GetById),
            "AdminReservations",
            new { id = dto!.Id },
            dto);
    }
}
