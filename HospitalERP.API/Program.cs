using System.Text;
using HospitalERP.Application.Interfaces;
using HospitalERP.Application.Services;
using HospitalERP.API.Hubs;
using HospitalERP.API.Services;
using HospitalERP.Infrastructure.Data;
using HospitalERP.Infrastructure.UnitOfWork;
using HospitalERP.API.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var defaultConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not configured.");

// Database
builder.Services.AddDbContext<HospitalERPDbContext>(options =>
    options.UseSqlServer(defaultConnectionString,
        sqlOptions => sqlOptions.MigrationsAssembly("HospitalERP.Infrastructure")));

// Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IAccountingService, AccountingService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<ISalesService, SalesService>();
builder.Services.AddScoped<IHRService, HRService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportingService, ReportingService>();
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<ILabService, LabService>();
builder.Services.AddScoped<IRadiologyService, RadiologyService>();
builder.Services.AddScoped<IClinicalService, ClinicalService>();
builder.Services.AddScoped<IPharmacyService, PharmacyService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBedManagementService, BedManagementService>();
builder.Services.AddScoped<IBedBillingService, BedBillingService>();
builder.Services.AddScoped<IMessagingService, MessagingService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IOTService, OTService>();
builder.Services.AddScoped<ISurgeryBillingService, SurgeryBillingService>();
builder.Services.AddScoped<IAppNotificationService, AppNotificationService>();
builder.Services.AddScoped<IInsuranceService, InsuranceService>();
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IEmergencyService, EmergencyService>();
builder.Services.AddScoped<IBloodBankService, BloodBankService>();
builder.Services.AddScoped<IMaternityService, MaternityService>();
builder.Services.AddScoped<IPhysiotherapyService, PhysiotherapyService>();
builder.Services.AddScoped<IDentalService, DentalService>();
builder.Services.AddScoped<IFleetService, FleetService>();
builder.Services.AddScoped<IDietaryService, DietaryService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IHousekeepingService, HousekeepingService>();
builder.Services.AddScoped<IQualityService, QualityService>();
builder.Services.AddScoped<IPatientPortalService, PatientPortalService>();
builder.Services.AddScoped<ISupportService, SupportService>();
builder.Services.AddScoped<ITelehealthService, TelehealthService>();
builder.Services.AddScoped<IHRExtendedService, HRExtendedService>();
builder.Services.AddScoped<IReferralService, ReferralService>();
builder.Services.AddScoped<IAdvancedSupplyService, AdvancedSupplyService>();

// Background Workers
builder.Services.AddHostedService<HospitalERP.API.Background.AutomatedBillingWorker>();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "HospitalERPSecretKey2024SuperSecureRandomString";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "HospitalERP";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "HospitalERPClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        // Support SignalR JWT delivered via query string
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// SignalR
builder.Services.AddSignalR();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://localhost:4201",
                "http://localhost",
                "http://localhost:8080",
                "http://127.0.0.1:4200",
                "http://127.0.0.1:4201",
                "http://127.0.0.1")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hospital ERP API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Enter: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Auto-migrate & seed (skipped in EF design-time tooling)
if (Environment.GetEnvironmentVariable("ASPNETCORE_DESIGNTIME") != "1")
using (var scope = app.Services.CreateScope())
{
    var sp = scope.ServiceProvider;
    var db = sp.GetRequiredService<HospitalERPDbContext>();
    var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("Bootstrap");

    // STEP 1: Reconnect to master and hard-reset HospitalERP to avoid
    // "There is already an object named 'Roles'" (caused by a DB that was
    // created via EnsureCreated and now has no migration history).
    try
    {
        var csb = new SqlConnectionStringBuilder(defaultConnectionString)
        {
            InitialCatalog = "master"
        };

        using var master = new SqlConnection(csb.ConnectionString);
        master.Open();

        using (var kill = master.CreateCommand())
        {
            kill.CommandText = @"
                DECLARE @sql NVARCHAR(MAX) = N'';
                SELECT @sql = @sql + N'KILL ' + CAST(session_id AS NVARCHAR(20)) + N';'
                FROM sys.dm_exec_sessions
                WHERE database_id = DB_ID(N'HospitalERP') AND session_id <> @@SPID;
                IF @sql <> N'' EXEC sp_executesql @sql;";
            kill.ExecuteNonQuery();
        }

        using (var drop = master.CreateCommand())
        {
            drop.CommandText = @"
                IF DB_ID(N'HospitalERP') IS NOT NULL
                BEGIN
                    ALTER DATABASE [HospitalERP] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                    DROP DATABASE [HospitalERP];
                END";
            drop.ExecuteNonQuery();
        }

        logger.LogInformation("Hard-reset of database 'HospitalERP' completed (dropped if present).");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Could not hard-reset database 'HospitalERP'; continuing with EnsureDeleted fallback.");
        try { db.Database.EnsureDeleted(); } catch (Exception ex2) { logger.LogWarning(ex2, "EnsureDeleted also failed."); }
    }

    // STEP 2: Apply all migrations from a clean slate.
    logger.LogInformation("Applying migrations...");
    db.Database.Migrate();
    logger.LogInformation("Migrations applied successfully.");

    // STEP 3: Seed comprehensive demo data (brand-new DB -> no constraint clashes).
    logger.LogInformation("Seeding demo data...");
    await DemoDataSeeder.SeedAsync(db, logger);
    logger.LogInformation("Seeding completed.");
}

// Middleware
app.UseGlobalExceptionHandler();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital ERP API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHealthChecks("/health");

app.Run();
