using Microsoft.AspNetCore.Mvc;
using PacificLuxe.Api.Enums;
using PacificLuxe.Api.Features.Availability;

namespace PacificLuxe.Api.Features.Vehicles;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;
    private readonly IAvailabilityService _availabilityService;

    public VehiclesController(IVehicleService vehicleService, IAvailabilityService availabilityService)
    {
        _vehicleService = vehicleService;
        _availabilityService = availabilityService;
    }

    /// <summary>
    /// List vehicles (public). Returns available and offline (displayable) inventory; maintenance/retired are excluded.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VehicleSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VehicleSummaryDto>>> GetVehicles(
        CancellationToken ct = default)
    {
        var vehicles = await _vehicleService.GetListAsync(adminView: false, statusFilter: null, ct);
        return Ok(vehicles);
    }

    /// <summary>
    /// Get availability for a vehicle (blocks and blocked date ranges).
    /// Optional from/to to scope the date range (defaults to today + 3 months).
    /// </summary>
    [HttpGet("{vehicleId:guid}/availability")]
    [ProducesResponseType(typeof(VehicleAvailabilityDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VehicleAvailabilityDto>> GetAvailability(
        Guid vehicleId,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken ct = default)
    {
        var availability = await _availabilityService.GetVehicleAvailabilityAsync(vehicleId, from, to, ct);
        if (availability == null)
            return NotFound("Vehicle not found.");

        return Ok(availability);
    }

    /// <summary>
    /// Get a vehicle by slug (public). Returns 404 if not available.
    /// </summary>
    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(VehicleDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VehicleDetailDto>> GetBySlug(string slug, CancellationToken ct = default)
    {
        var vehicle = await _vehicleService.GetBySlugAsync(slug, adminView: false, ct);
        if (vehicle == null)
            return NotFound();

        return Ok(vehicle);
    }
}
