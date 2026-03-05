using HospitalERP.Application.DTOs;
using HospitalERP.Application.DTOs.BedManagement;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Doctor,Nurse,Receptionist")]
public class BedManagementController : ControllerBase
{
    private readonly IBedManagementService _bedService;

    public BedManagementController(IBedManagementService bedService)
    {
        _bedService = bedService;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0";

    // --- Wards ---
    [HttpGet("wards")]
    public async Task<ActionResult<PagedResult<WardDto>>> GetWards([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string search = "")
    {
        return Ok(await _bedService.GetWardsAsync(page, pageSize, search));
    }

    [HttpGet("wards/{id}")]
    public async Task<ActionResult<WardDto>> GetWard(int id)
    {
        return Ok(await _bedService.GetWardByIdAsync(id));
    }

    [HttpPost("wards")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<WardDto>> CreateWard(CreateWardDto dto)
    {
        return Ok(await _bedService.CreateWardAsync(dto, GetUserId()));
    }

    [HttpPut("wards/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateWard(int id, CreateWardDto dto)
    {
        await _bedService.UpdateWardAsync(id, dto, GetUserId());
        return NoContent();
    }

    [HttpDelete("wards/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteWard(int id)
    {
        await _bedService.DeleteWardAsync(id, GetUserId());
        return NoContent();
    }

    // --- Rooms ---
    [HttpGet("wards/{wardId}/rooms")]
    public async Task<ActionResult<PagedResult<RoomDto>>> GetRooms(int wardId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string search = "")
    {
        return Ok(await _bedService.GetRoomsAsync(wardId, page, pageSize, search));
    }

    [HttpGet("rooms/{id}")]
    public async Task<ActionResult<RoomDto>> GetRoom(int id)
    {
        return Ok(await _bedService.GetRoomByIdAsync(id));
    }

    [HttpPost("rooms")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RoomDto>> CreateRoom(CreateRoomDto dto)
    {
        return Ok(await _bedService.CreateRoomAsync(dto, GetUserId()));
    }

    [HttpPut("rooms/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateRoom(int id, CreateRoomDto dto)
    {
        await _bedService.UpdateRoomAsync(id, dto, GetUserId());
        return NoContent();
    }

    [HttpDelete("rooms/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        await _bedService.DeleteRoomAsync(id, GetUserId());
        return NoContent();
    }

    // --- Beds ---
    [HttpGet("beds")]
    public async Task<ActionResult<PagedResult<BedDto>>> GetBeds([FromQuery] int? wardId, [FromQuery] int? roomId, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string search = "")
    {
        return Ok(await _bedService.GetBedsAsync(wardId, roomId, status, page, pageSize, search));
    }

    [HttpGet("beds/{id}")]
    public async Task<ActionResult<BedDto>> GetBed(int id)
    {
        return Ok(await _bedService.GetBedByIdAsync(id));
    }

    [HttpPost("beds")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BedDto>> CreateBed(CreateBedDto dto)
    {
        return Ok(await _bedService.CreateBedAsync(dto, GetUserId()));
    }

    [HttpPut("beds/{id}")]
    [Authorize(Roles = "Admin,Nurse")]
    public async Task<IActionResult> UpdateBed(int id, CreateBedDto dto)
    {
        await _bedService.UpdateBedAsync(id, dto, GetUserId());
        return NoContent();
    }

    [HttpDelete("beds/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBed(int id)
    {
        await _bedService.DeleteBedAsync(id, GetUserId());
        return NoContent();
    }

    // --- Admissions ---
    [HttpGet("admissions")]
    public async Task<ActionResult<PagedResult<BedAdmissionDto>>> GetAdmissions([FromQuery] int? patientId, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        return Ok(await _bedService.GetAdmissionsAsync(patientId, status, page, pageSize));
    }

    [HttpPost("admissions")]
    public async Task<ActionResult<BedAdmissionDto>> AdmitPatient(AdmitPatientDto dto)
    {
        return Ok(await _bedService.AdmitPatientAsync(dto, GetUserId()));
    }

    [HttpPost("admissions/{id}/discharge")]
    public async Task<IActionResult> DischargePatient(int id, DischargePatientDto dto)
    {
        await _bedService.DischargePatientAsync(id, dto, GetUserId());
        return NoContent();
    }

    [HttpPost("admissions/{id}/transfer")]
    public async Task<IActionResult> TransferPatient(int id, [FromBody] int newBedId)
    {
        await _bedService.TransferPatientAsync(id, newBedId, GetUserId());
        return NoContent();
    }
}
