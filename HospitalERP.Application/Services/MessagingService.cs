using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Common;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.SignalR;
using HospitalERP.API.Hubs;

namespace HospitalERP.Application.Services;

public class MessagingService : IMessagingService
{
    private readonly IUnitOfWork _uow;
    private readonly IHubContext<NotificationHub> _hubContext;

    public MessagingService(IUnitOfWork uow, IHubContext<NotificationHub> hubContext)
    {
        _uow = uow;
        _hubContext = hubContext;
    }

    public async Task<MessageDto> SendMessageAsync(int senderId, SendMessageDto dto)
    {
        var msg = new Message
        {
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            Content = dto.Content,
            IsRead = false,
            SentAt = DateTime.UtcNow
        };

        await _uow.Messages.AddAsync(msg);
        await _uow.SaveChangesAsync();

        var sender = await _uow.Users.GetByIdAsync(senderId);
        var receiver = await _uow.Users.GetByIdAsync(dto.ReceiverId);

        var result = new MessageDto
        {
            Id = msg.Id,
            SenderId = msg.SenderId,
            SenderName = sender?.FullName ?? "Unknown",
            ReceiverId = msg.ReceiverId,
            ReceiverName = receiver?.FullName ?? "Unknown",
            Content = msg.Content,
            IsRead = msg.IsRead,
            SentAt = msg.SentAt
        };

        // Notify Receiver via SignalR
        await _hubContext.Clients.Group($"user-{dto.ReceiverId}").SendAsync("ReceiveMessage", result);

        return result;
    }

    public async Task<PagedResult<MessageDto>> GetInboxAsync(int userId, int page = 1, int pageSize = 20)
    {
        var result = await _uow.Messages.FindAsync(
            m => m.ReceiverId == userId,
            q => q.OrderByDescending(x => x.SentAt),
            $"{nameof(Message.Sender)},{nameof(Message.Receiver)}",
            page, pageSize);

        var query = await _uow.Messages.QueryAsync(m => m.ReceiverId == userId);
        int total = query.Count();

        var dtos = result.Select(m => new MessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            SenderName = m.Sender.FullName,
            ReceiverId = m.ReceiverId,
            ReceiverName = m.Receiver.FullName,
            Content = m.Content,
            IsRead = m.IsRead,
            SentAt = m.SentAt
        });

        return new PagedResult<MessageDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<MessageDto>> GetSentMailsAsync(int userId, int page = 1, int pageSize = 20)
    {
        var result = await _uow.Messages.FindAsync(
            m => m.SenderId == userId,
            q => q.OrderByDescending(x => x.SentAt),
            $"{nameof(Message.Sender)},{nameof(Message.Receiver)}",
            page, pageSize);

        var query = await _uow.Messages.QueryAsync(m => m.SenderId == userId);
        int total = query.Count();

        var dtos = result.Select(m => new MessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            SenderName = m.Sender.FullName,
            ReceiverId = m.ReceiverId,
            ReceiverName = m.Receiver.FullName,
            Content = m.Content,
            IsRead = m.IsRead,
            SentAt = m.SentAt
        });

        return new PagedResult<MessageDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task MarkAsReadAsync(int messageId, int userId)
    {
        var msg = await _uow.Messages.GetByIdAsync(messageId);
        if (msg == null || msg.ReceiverId != userId) return;

        msg.IsRead = true;
        await _uow.Messages.UpdateAsync(msg);
        await _uow.SaveChangesAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        var query = await _uow.Messages.QueryAsync(m => m.ReceiverId == userId && !m.IsRead);
        return query.Count();
    }
}
