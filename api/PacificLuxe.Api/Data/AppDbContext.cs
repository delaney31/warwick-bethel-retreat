using Microsoft.EntityFrameworkCore;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<AvailabilityBlock> AvailabilityBlocks => Set<AvailabilityBlock>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<DriverDocument> DriverDocuments => Set<DriverDocument>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<SignedAgreement> SignedAgreements => Set<SignedAgreement>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PickupChecklist> PickupChecklists => Set<PickupChecklist>();
    public DbSet<ReturnChecklist> ReturnChecklists => Set<ReturnChecklist>();
    public DbSet<AdditionalCharge> AdditionalCharges => Set<AdditionalCharge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAtUtc = now;
                entry.Entity.UpdatedAtUtc = now;
                if (entry.Entity.Id == Guid.Empty)
                    entry.Entity.Id = Guid.NewGuid();
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = now;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
