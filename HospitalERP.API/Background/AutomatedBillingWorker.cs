using HospitalERP.Application.Interfaces;

namespace HospitalERP.API.Background;

public class AutomatedBillingWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AutomatedBillingWorker> _logger;

    public AutomatedBillingWorker(IServiceProvider serviceProvider, ILogger<AutomatedBillingWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Automated Billing Worker starting...");

        while (!stoppingToken.IsCancellationRequested)
        {
            // Scheduling logic: Run every 24 hours
            // For demo purposes, we might want it to run more frequently, but for production, once at midnight is typical.
            // Let's aim for 1:00 AM UTC.
            
            var now = DateTime.UtcNow;
            var nextRun = now.Date.AddDays(1).AddHours(1); // 1 AM tomorrow
            var delay = nextRun - now;

            _logger.LogInformation("Next automated billing run scheduled for: {NextRun}", nextRun);

            try
            {
                // Wait until the scheduled time or cancellation
                await Task.Delay(delay, stoppingToken);
                
                using (var scope = _serviceProvider.CreateScope())
                {
                    var billingService = scope.ServiceProvider.GetRequiredService<IBedBillingService>();
                    _logger.LogInformation("Executing automated daily inpatient billing process...");
                    
                    // We use a reserved system user ID for background tasks
                    await billingService.ProcessDailyBillingAsync("SYSTEM_SERVICE");
                    
                    _logger.LogInformation("Automated daily billing process completed.");
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Automated Billing Worker is stopping due to cancellation.");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during the automated billing cycle.");
                // Wait 15 minutes before retrying on error
                await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
            }
        }
    }
}
