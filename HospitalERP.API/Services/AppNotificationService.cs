using HospitalERP.API.Hubs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace HospitalERP.API.Services;

public class AppNotificationService : IAppNotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public AppNotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendMessageAsync(int receiverId, string method, object payload)
    {
        await _hubContext.Clients.Group($"user-{receiverId}").SendAsync(method, payload);
    }

    public async Task SendToAllAsync(string method, object payload)
    {
        await _hubContext.Clients.Group("all").SendAsync(method, payload);
    }
}
