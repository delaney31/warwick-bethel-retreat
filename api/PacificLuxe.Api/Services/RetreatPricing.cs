using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Services;

public static class RetreatPricing
{
    public const decimal BaseNightlyRate = 150m;
    public const decimal ExtraGuestNightlyRate = 25m;
    public const int GuestsIncluded = 2;

    public static bool IsRetreatProperty(Vehicle vehicle) =>
        string.Equals(vehicle.Slug, RetreatDataSeeder.WarwickSlug, StringComparison.OrdinalIgnoreCase);

    public static int RentalDays(DateOnly start, DateOnly end) =>
        end.DayNumber - start.DayNumber + 1;

    public static decimal CalculateSubtotal(int guestCount, int nights)
    {
        var extraGuests = Math.Max(0, guestCount - GuestsIncluded);
        var nightly = BaseNightlyRate + extraGuests * ExtraGuestNightlyRate;
        return nightly * nights;
    }

    public static (decimal dailyRate, decimal subtotal) ForReservation(Vehicle vehicle, Reservation reservation)
    {
        var nights = RentalDays(reservation.StartDateUtc, reservation.EndDateUtc);
        if (!IsRetreatProperty(vehicle))
        {
            var subtotal = vehicle.DailyRate * nights;
            return (vehicle.DailyRate, subtotal);
        }

        var sub = CalculateSubtotal(reservation.DriverAge, nights);
        return (BaseNightlyRate, sub);
    }
}
