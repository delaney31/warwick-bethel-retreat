using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PacificLuxe.Api.Data;

/// <summary>
/// Used by EF Core tools (migrations) when no app is running.
/// Uses SQLite so migrations work without PostgreSQL.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection")
            ?? "Data Source=pacific_luxe.db";

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        if (connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
            optionsBuilder.UseSqlite(connectionString);
        else
            optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}
