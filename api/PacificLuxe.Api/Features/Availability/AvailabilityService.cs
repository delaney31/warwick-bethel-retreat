using Microsoft.EntityFrameworkCore;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Availability;

public class AvailabilityService : IAvailabilityService
{
    private readonly AppDbContext _db;

    public AvailabilityService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<VehicleAvailabilityDto?> GetVehicleAvailabilityAsync(Guid vehicleId, DateOnly? from, DateOnly? to, CancellationToken ct = default)
    {
        var vehicleExists = await _db.Vehicles.AnyAsync(v => v.Id == vehicleId, ct);
        if (!vehicleExists)
            return null;

        var fromDate = from ?? DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var toDate = to ?? fromDate.AddMonths(3);

        var blocks = await _db.AvailabilityBlocks
            .AsNoTracking()
            .Where(b => b.VehicleId == vehicleId
                && b.EndDateUtc >= fromDate
                && b.StartDateUtc <= toDate)
            .OrderBy(b => b.StartDateUtc)
            .Select(b => new AvailabilityBlockDto(
                b.Id,
                b.VehicleId,
                b.StartDateUtc,
                b.EndDateUtc,
                b.Reason,
                b.Notes,
                b.CreatedAtUtc))
            .ToListAsync(ct);

        var reservationRanges = await _db.Reservations
            .AsNoTracking()
            .Where(r => r.VehicleId == vehicleId
                && r.Status != ReservationStatus.Cancelled
                && r.Status != ReservationStatus.Rejected
                && r.EndDateUtc >= fromDate
                && r.StartDateUtc <= toDate)
            .Select(r => new DateRangeDto(r.StartDateUtc, r.EndDateUtc))
            .ToListAsync(ct);

        var blockRanges = blocks.Select(b => new DateRangeDto(b.StartDateUtc, b.EndDateUtc)).ToList();
        var blockedRanges = reservationRanges.Concat(blockRanges).ToList();

        return new VehicleAvailabilityDto(
            vehicleId,
            fromDate,
            toDate,
            blocks,
            blockedRanges);
    }

    public async Task<bool> IsVehicleAvailableForDatesAsync(Guid vehicleId, DateOnly startDate, DateOnly endDate, Guid? excludeReservationId = null, CancellationToken ct = default)
    {
        var vehicle = await _db.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.Id == vehicleId, ct);
        if (vehicle == null || vehicle.Status != VehicleStatus.Available)
            return false;

        if (startDate > endDate)
            return false;

        var hasConflictingReservation = await _db.Reservations
            .AsNoTracking()
            .AnyAsync(r => r.VehicleId == vehicleId
                && r.Status != ReservationStatus.Cancelled
                && r.Status != ReservationStatus.Rejected
                && r.StartDateUtc <= endDate
                && r.EndDateUtc >= startDate
                && (!excludeReservationId.HasValue || r.Id != excludeReservationId.Value),
                ct);

        if (hasConflictingReservation)
            return false;

        var hasConflictingBlock = await _db.AvailabilityBlocks
            .AsNoTracking()
            .AnyAsync(b => b.VehicleId == vehicleId
                && b.StartDateUtc <= endDate
                && b.EndDateUtc >= startDate,
                ct);

        return !hasConflictingBlock;
    }

    public async Task<(AvailabilityBlockDto? Dto, string? Error)> CreateBlockAsync(CreateAvailabilityBlockRequest request, CancellationToken ct = default)
    {
        var error = ValidateCreateBlock(request);
        if (error != null)
            return (null, error);

        var vehicleExists = await _db.Vehicles.AnyAsync(v => v.Id == request.VehicleId, ct);
        if (!vehicleExists)
            return (null, "Vehicle not found.");

        var hasOverlap = await _db.AvailabilityBlocks
            .AnyAsync(b => b.VehicleId == request.VehicleId
                && b.StartDateUtc <= request.EndDateUtc
                && b.EndDateUtc >= request.StartDateUtc,
                ct);

        if (hasOverlap)
            return (null, "Date range overlaps with an existing availability block.");

        var block = new AvailabilityBlock
        {
            VehicleId = request.VehicleId,
            StartDateUtc = request.StartDateUtc,
            EndDateUtc = request.EndDateUtc,
            Reason = request.Reason.Trim(),
            Notes = request.Notes?.Trim(),
        };

        _db.AvailabilityBlocks.Add(block);
        await _db.SaveChangesAsync(ct);

        return (new AvailabilityBlockDto(
            block.Id,
            block.VehicleId,
            block.StartDateUtc,
            block.EndDateUtc,
            block.Reason,
            block.Notes,
            block.CreatedAtUtc), null);
    }

    public async Task<(bool Success, string? Error)> DeleteBlockAsync(Guid id, CancellationToken ct = default)
    {
        var block = await _db.AvailabilityBlocks.FirstOrDefaultAsync(b => b.Id == id, ct);
        if (block == null)
            return (false, "Availability block not found.");

        _db.AvailabilityBlocks.Remove(block);
        await _db.SaveChangesAsync(ct);

        return (true, null);
    }

    private static string? ValidateCreateBlock(CreateAvailabilityBlockRequest r)
    {
        if (r.StartDateUtc > r.EndDateUtc)
            return "Start date must be on or before end date.";
        if (string.IsNullOrWhiteSpace(r.Reason))
            return "Reason is required.";
        return null;
    }
}
