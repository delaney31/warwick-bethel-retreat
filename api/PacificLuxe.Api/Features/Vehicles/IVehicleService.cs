using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Vehicles;

public interface IVehicleService
{
    Task<IReadOnlyList<VehicleSummaryDto>> GetListAsync(bool adminView, VehicleStatus? statusFilter, CancellationToken ct = default);
    Task<VehicleDetailDto?> GetBySlugAsync(string slug, bool adminView, CancellationToken ct = default);
    Task<VehicleDetailDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<(VehicleDetailDto? Dto, string? Error)> CreateAsync(CreateVehicleRequest request, CancellationToken ct = default);
    Task<(VehicleDetailDto? Dto, string? Error)> UpdateAsync(Guid id, UpdateVehicleRequest request, CancellationToken ct = default);
    Task<(bool Success, string? Error)> DeleteAsync(Guid id, CancellationToken ct = default);
}
