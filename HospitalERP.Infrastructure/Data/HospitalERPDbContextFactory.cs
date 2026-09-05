using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HospitalERP.Infrastructure.Data;

public sealed class HospitalERPDbContextFactory : IDesignTimeDbContextFactory<HospitalERPDbContext>
{
    public HospitalERPDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<HospitalERPDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=tcp:127.0.0.1,1433;Database=HospitalERP;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;",
            sql => sql.MigrationsAssembly("HospitalERP.Infrastructure"));
        return new HospitalERPDbContext(optionsBuilder.Options);
    }
}
