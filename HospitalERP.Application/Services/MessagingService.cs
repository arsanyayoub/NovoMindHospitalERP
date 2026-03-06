using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Common;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class MessagingService : IMessagingService
{
    private readonly IUnitOfWork _uow;
    private readonly IAppNotificationService _notificationService;

    public MessagingService(IUnitOfWork uow, IAppNotificationService notificationService)
    {
        _uow = uow;
        _notificationService = notificationService;
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
        await _notificationService.SendMessageAsync(dto.ReceiverId, "ReceiveMessage", result);

        return result;
    }

    public async Task<PagedResult<MessageDto>> GetInboxAsync(int userId, int page = 1, int pageSize = 20)
    {
        var query = _uow.Messages.Query().Where(m => m.ReceiverId == userId);
        int total = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.CountAsync(query);

        var result = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(
            query.Include(m => m.Sender).Include(m => m.Receiver)
                 .OrderByDescending(x => x.SentAt)
                 .Skip((page - 1) * pageSize)
                 .Take(pageSize));

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

        return new PagedResult<MessageDto>(dtos, total, page, pageSize);
    }

    public async Task<PagedResult<MessageDto>> GetSentMailsAsync(int userId, int page = 1, int pageSize = 20)
    {
        var query = _uow.Messages.Query().Where(m => m.SenderId == userId);
        int total = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.CountAsync(query);

        var result = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(
            query.Include(m => m.Sender).Include(m => m.Receiver)
                 .OrderByDescending(x => x.SentAt)
                 .Skip((page - 1) * pageSize)
                 .Take(pageSize));

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

        return new PagedResult<MessageDto>(dtos, total, page, pageSize);
    }

    public async Task MarkAsReadAsync(int messageId, int userId)
    {
        var msg = await _uow.Messages.GetByIdAsync(messageId);
        if (msg == null || msg.ReceiverId != userId) return;

        msg.IsRead = true;
        _uow.Messages.Update(msg);
        await _uow.SaveChangesAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        var query = _uow.Messages.Query().Where(m => m.ReceiverId == userId && !m.IsRead);
        return await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.CountAsync(query);
    }
}
