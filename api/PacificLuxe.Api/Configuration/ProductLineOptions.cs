namespace PacificLuxe.Api.Configuration;

/// <summary>
/// Vehicle = Pacific Luxe Direct fleet. Retreat = Warwick Bethel Retreat (single property).
/// Set via ProductLine in appsettings or environment variable ProductLine.
/// </summary>
public sealed class ProductLineOptions
{
    public const string SectionName = "ProductLine";

    public ProductLineKind Value { get; set; } = ProductLineKind.Vehicle;

    public bool IsRetreat => Value == ProductLineKind.Retreat;
}

public enum ProductLineKind
{
    Vehicle,
    Retreat,
}
