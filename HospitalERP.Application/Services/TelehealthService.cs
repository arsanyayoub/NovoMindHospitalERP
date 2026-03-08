using HospitalERP.Application.Interfaces;
using HospitalERP.Infrastructure.UnitOfWork;

namespace HospitalERP.Application.Services;

public class TelehealthService : ITelehealthService
{
    private readonly IUnitOfWork _uow;

    public TelehealthService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<string> GenerateMeetingLinkAsync(int appointmentId)
    {
        var appointment = await _uow.Appointments.GetByIdAsync(appointmentId);
        if (appointment == null) throw new Exception("Appointment not found");

        // Using a secure hashed link or third-party integration (Mocking with Jitsi pattern)
        string roomName = $"NovoMind_App_{appointmentId}_{Guid.NewGuid().ToString().Substring(0,8)}";
        string link = $"https://meet.jit.si/{roomName}";

        appointment.IsTelehealth = true;
        appointment.MeetingLink = link;
        appointment.VirtualWaitingRoomStatus = "Waiting";

        await _uow.SaveChangesAsync();
        return link;
    }

    public async Task UpdateWaitingRoomStatusAsync(int appointmentId, string status)
    {
        var appointment = await _uow.Appointments.GetByIdAsync(appointmentId);
        if (appointment != null)
        {
            appointment.VirtualWaitingRoomStatus = status;
            await _uow.SaveChangesAsync();
        }
    }
}
