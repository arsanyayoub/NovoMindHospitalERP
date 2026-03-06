using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagingController : ControllerBase
{
    private readonly IMessagingService _svc;

    public MessagingController(IMessagingService svc)
    {
        _svc = svc;
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] SendMessageDto dto)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var msg = await _svc.SendMessageAsync(userId, dto);
        return Ok(msg);
    }

    [HttpGet("inbox")]
    public async Task<ActionResult<PagedResult<MessageDto>>> GetInbox([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var inbox = await _svc.GetInboxAsync(userId, page, pageSize);
        return Ok(inbox);
    }

    [HttpGet("sent")]
    public async Task<ActionResult<PagedResult<MessageDto>>> GetSent([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var sent = await _svc.GetSentMailsAsync(userId, page, pageSize);
        return Ok(sent);
    }

    [HttpPut("{id}/read")]
    public async Task<ActionResult> MarkAsRead(int id)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        await _svc.MarkAsReadAsync(id, userId);
        return NoContent();
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var count = await _svc.GetUnreadCountAsync(userId);
        return Ok(count);
    }
}
