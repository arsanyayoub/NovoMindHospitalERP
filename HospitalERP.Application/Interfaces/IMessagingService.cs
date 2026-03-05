using HospitalERP.Application.DTOs;
using HospitalERP.Domain.Common;

namespace HospitalERP.Application.Interfaces;

public interface IMessagingService
{
    Task<MessageDto> SendMessageAsync(int senderId, SendMessageDto dto);
    Task<PagedResult<MessageDto>> GetInboxAsync(int userId, int page = 1, int pageSize = 20);
    Task<PagedResult<MessageDto>> GetSentMailsAsync(int userId, int page = 1, int pageSize = 20);
    Task MarkAsReadAsync(int messageId, int userId);
    Task<int> GetUnreadCountAsync(int userId);
}
