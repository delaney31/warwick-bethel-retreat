using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Availability;

[ApiController]
[Route("api/[controller]")]
public class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;

    public AvailabilityController(IAvailabilityService availabilityService)
    {
        _availabilityService = availabilityService;
    }

    /// <summary>
    /// Check if a vehicle is available for the given date range.
    /// Use excludeReservationId when editing an existing reservation.
    /// </summary>
    [HttpGet("check")]
    [ProducesResponseType(typeof(AvailabilityCheckDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AvailabilityCheckDto>> Check(
        [FromQuery] Guid vehicleId,
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate,
        [FromQuery] Guid? excludeReservationId = null,
        CancellationToken ct = default)
    {
        var isAvailable = await _availabilityService.IsVehicleAvailableForDatesAsync(vehicleId, startDate, endDate, excludeReservationId, ct);

        string? reason = null;
        if (!isAvailable)
        {
            if (startDate > endDate)
                reason = "Invalid date range.";
            else
                reason = "Date range overlaps with reservation or availability block, or vehicle is not available.";
        }

        return Ok(new AvailabilityCheckDto(vehicleId, startDate, endDate, isAvailable, reason));
    }
}
