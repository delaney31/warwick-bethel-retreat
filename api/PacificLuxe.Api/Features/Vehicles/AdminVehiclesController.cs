using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Vehicles;

[ApiController]
[Route("api/admin/vehicles")]
[Authorize(Roles = "Admin")]
public class AdminVehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public AdminVehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    /// <summary>
    /// List all vehicles (admin). Supports optional status filter.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VehicleSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VehicleSummaryDto>>> GetVehicles(
        [FromQuery] VehicleStatus? status,
        CancellationToken ct = default)
    {
        var vehicles = await _vehicleService.GetListAsync(adminView: true, statusFilter: status, ct);
        return Ok(vehicles);
    }

    /// <summary>
    /// Get a vehicle by ID (admin).
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(VehicleDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VehicleDetailDto>> GetById(Guid id, CancellationToken ct = default)
    {
        var vehicle = await _vehicleService.GetByIdAsync(id, ct);
        if (vehicle == null)
            return NotFound();

        return Ok(vehicle);
    }

    /// <summary>
    /// Create a new vehicle.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(VehicleDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VehicleDetailDto>> Create(
        [FromBody] CreateVehicleRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _vehicleService.CreateAsync(request, ct);

        if (error != null)
            return BadRequest(new { error });

        return CreatedAtAction(
            nameof(GetById),
            new { id = dto!.Id },
            dto);
    }

    /// <summary>
    /// Update a vehicle by ID.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(VehicleDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VehicleDetailDto>> Update(
        Guid id,
        [FromBody] UpdateVehicleRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _vehicleService.UpdateAsync(id, request, ct);

        if (error == "Vehicle not found.")
            return NotFound();

        if (error != null)
            return BadRequest(new { error });

        return Ok(dto);
    }

    /// <summary>
    /// Soft delete a vehicle (sets status to Retired).
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        var (success, error) = await _vehicleService.DeleteAsync(id, ct);

        if (error == "Vehicle not found.")
            return NotFound();

        return NoContent();
    }
}
