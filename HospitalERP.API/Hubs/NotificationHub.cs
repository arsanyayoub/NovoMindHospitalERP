using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HospitalERP.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (userId is not null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
        await Groups.AddToGroupAsync(Context.ConnectionId, "all");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (userId is not null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "all");
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendNotificationToAll(string title, string message, string type)
        => await Clients.Group("all").SendAsync("ReceiveNotification", new { title, message, type, timestamp = DateTime.UtcNow });

    public async Task SendNotificationToUser(string userId, string title, string message, string type)
        => await Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", new { title, message, type, timestamp = DateTime.UtcNow });

    // Real-time events
    public async Task AppointmentCreated(object appointment) => await Clients.Group("all").SendAsync("AppointmentCreated", appointment);
    public async Task InvoiceCreated(object invoice) => await Clients.Group("all").SendAsync("InvoiceCreated", invoice);
    public async Task PaymentReceived(object payment) => await Clients.Group("all").SendAsync("PaymentReceived", payment);
    public async Task StockUpdated(object stock) => await Clients.Group("all").SendAsync("StockUpdated", stock);
    public async Task DashboardUpdated(object data) => await Clients.Group("all").SendAsync("DashboardUpdated", data);
}
