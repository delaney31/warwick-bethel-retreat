using Microsoft.EntityFrameworkCore;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Vehicles;

public class VehicleService : IVehicleService
{
    private readonly AppDbContext _db;

    public VehicleService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<VehicleSummaryDto>> GetListAsync(bool adminView, VehicleStatus? statusFilter, CancellationToken ct = default)
    {
        var query = _db.Vehicles.AsNoTracking();

        if (!adminView)
            query = query.Where(v =>
                v.Status == VehicleStatus.Available || v.Status == VehicleStatus.Offline);
        else if (statusFilter.HasValue)
            query = query.Where(v => v.Status == statusFilter.Value);

        var vehicles = await query
            .OrderBy(v => v.DisplayName)
            .ToListAsync(ct);

        return vehicles.Select(v => v.ToSummaryDto()).ToList();
    }

    public async Task<VehicleDetailDto?> GetBySlugAsync(string slug, bool adminView, CancellationToken ct = default)
    {
        var query = _db.Vehicles.AsNoTracking().Where(v => v.Slug == slug);

        if (!adminView)
            query = query.Where(v =>
                v.Status == VehicleStatus.Available || v.Status == VehicleStatus.Offline);

        var vehicle = await query.FirstOrDefaultAsync(ct);
        return vehicle?.ToDetailDto();
    }

    public async Task<VehicleDetailDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var vehicle = await _db.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.Id == id, ct);
        return vehicle?.ToDetailDto();
    }

    public async Task<(VehicleDetailDto? Dto, string? Error)> CreateAsync(CreateVehicleRequest request, CancellationToken ct = default)
    {
        var error = ValidateCreate(request);
        if (error != null)
            return (null, error);

        var slug = request.Slug.Trim().ToLowerInvariant();
        if (await _db.Vehicles.AnyAsync(v => v.Slug == slug, ct))
            return (null, "A vehicle with this slug already exists.");

        var vehicle = new Vehicle
        {
            Slug = slug,
            DisplayName = request.DisplayName.Trim(),
            Year = request.Year,
            Make = request.Make.Trim(),
            Model = request.Model.Trim(),
            Trim = request.Trim?.Trim().NullIfEmpty(),
            DailyRate = request.DailyRate,
            IncludedMilesPerDay = request.IncludedMilesPerDay,
            LocationCity = request.LocationCity.Trim(),
            Status = request.Status,
            Description = request.Description.Trim(),
            HeroImage = request.HeroImage?.Trim().NullIfEmpty(),
        };

        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync(ct);

        return (vehicle.ToDetailDto(), null);
    }

    public async Task<(VehicleDetailDto? Dto, string? Error)> UpdateAsync(Guid id, UpdateVehicleRequest request, CancellationToken ct = default)
    {
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.Id == id, ct);
        if (vehicle == null)
            return (null, "Vehicle not found.");

        var error = ValidateUpdate(request);
        if (error != null)
            return (null, error);

        if (request.Slug != null)
        {
            var slug = request.Slug.Trim().ToLowerInvariant();
            if (slug != vehicle.Slug && await _db.Vehicles.AnyAsync(v => v.Slug == slug, ct))
                return (null, "A vehicle with this slug already exists.");
            vehicle.Slug = slug;
        }
        if (request.DisplayName != null) vehicle.DisplayName = request.DisplayName.Trim();
        if (request.Year.HasValue) vehicle.Year = request.Year.Value;
        if (request.Make != null) vehicle.Make = request.Make.Trim();
        if (request.Model != null) vehicle.Model = request.Model.Trim();
        if (request.Trim != null) vehicle.Trim = request.Trim.Trim().NullIfEmpty();
        if (request.DailyRate.HasValue) vehicle.DailyRate = request.DailyRate.Value;
        if (request.IncludedMilesPerDay.HasValue) vehicle.IncludedMilesPerDay = request.IncludedMilesPerDay.Value;
        if (request.LocationCity != null) vehicle.LocationCity = request.LocationCity.Trim();
        if (request.Status.HasValue) vehicle.Status = request.Status.Value;
        if (request.Description != null) vehicle.Description = request.Description.Trim();
        if (request.HeroImage != null) vehicle.HeroImage = request.HeroImage.Trim().NullIfEmpty();

        await _db.SaveChangesAsync(ct);

        return (vehicle.ToDetailDto(), null);
    }

    public async Task<(bool Success, string? Error)> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.Id == id, ct);
        if (vehicle == null)
            return (false, "Vehicle not found.");

        vehicle.Status = VehicleStatus.Retired;
        await _db.SaveChangesAsync(ct);

        return (true, null);
    }

    private static string? ValidateCreate(CreateVehicleRequest r)
    {
        if (string.IsNullOrWhiteSpace(r.Slug))
            return "Slug is required.";
        if (string.IsNullOrWhiteSpace(r.DisplayName))
            return "Display name is required.";
        if (r.Year < 1900 || r.Year > 2100)
            return "Year must be between 1900 and 2100.";
        if (string.IsNullOrWhiteSpace(r.Make))
            return "Make is required.";
        if (string.IsNullOrWhiteSpace(r.Model))
            return "Model is required.";
        if (r.DailyRate < 0)
            return "Daily rate must be non-negative.";
        if (r.IncludedMilesPerDay < 0)
            return "Included miles per day must be non-negative.";
        if (string.IsNullOrWhiteSpace(r.LocationCity))
            return "Location city is required.";
        if (string.IsNullOrWhiteSpace(r.Description))
            return "Description is required.";
        return null;
    }

    private static string? ValidateUpdate(UpdateVehicleRequest r)
    {
        if (r.Slug is { Length: 0 })
            return "Slug cannot be empty.";
        if (r.DisplayName is { Length: 0 })
            return "Display name cannot be empty.";
        if (r.Year is < 1900 or > 2100)
            return "Year must be between 1900 and 2100.";
        if (r.Make is { Length: 0 })
            return "Make cannot be empty.";
        if (r.Model is { Length: 0 })
            return "Model cannot be empty.";
        if (r.DailyRate is < 0)
            return "Daily rate must be non-negative.";
        if (r.IncludedMilesPerDay is < 0)
            return "Included miles per day must be non-negative.";
        if (r.LocationCity is { Length: 0 })
            return "Location city cannot be empty.";
        if (r.Description is { Length: 0 })
            return "Description cannot be empty.";
        return null;
    }
}

internal static class VehicleServiceStringExtensions
{
    public static string? NullIfEmpty(this string s) =>
        string.IsNullOrWhiteSpace(s) ? null : s.Trim();
}
