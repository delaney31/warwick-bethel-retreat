using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Entities;

public class Reservation : BaseEntity
{
    public Guid VehicleId { get; set; }
    public string RenterName { get; set; } = string.Empty;
    public string RenterEmail { get; set; } = string.Empty;
    public string RenterPhone { get; set; } = string.Empty;
    public DateOnly StartDateUtc { get; set; }
    public DateOnly EndDateUtc { get; set; }
    public PickupPreference PickupPreference { get; set; } = PickupPreference.SantaMonica;
    public int DriverAge { get; set; }
    public string Notes { get; set; } = string.Empty;
    public ReservationStatus Status { get; set; } = ReservationStatus.PendingReview;

    public Vehicle Vehicle { get; set; } = null!;

    public ICollection<DriverDocument> DriverDocuments { get; set; } = [];

    public SignedAgreement? Agreement { get; set; }

    public ICollection<Payment> Payments { get; set; } = [];

    public PickupChecklist? PickupChecklist { get; set; }

    public ReturnChecklist? ReturnChecklist { get; set; }

    public ICollection<AdditionalCharge> AdditionalCharges { get; set; } = [];
}
