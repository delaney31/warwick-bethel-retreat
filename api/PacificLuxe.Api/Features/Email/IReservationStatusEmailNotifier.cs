using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Email;

public interface IReservationStatusEmailNotifier
{
    /// <summary>
    /// Sends a transactional email when the reservation moves to a status that renters should know about.
    /// Does not throw; logs failures. Safe to call after DB commit.
    /// </summary>
    Task NotifyStatusChangedAsync(
        Reservation reservation,
        ReservationStatus previousStatus,
        ReservationStatus newStatus,
        string? adminMessage,
        CancellationToken ct = default);
}
