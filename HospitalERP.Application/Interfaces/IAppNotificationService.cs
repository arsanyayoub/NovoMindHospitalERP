namespace HospitalERP.Application.Interfaces;

public interface IAppNotificationService
{
    Task SendMessageAsync(int receiverId, string method, object payload);
    Task SendToAllAsync(string method, object payload);
}
