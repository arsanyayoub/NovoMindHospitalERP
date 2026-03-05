using HospitalERP.Application.DTOs;
using HospitalERP.Application.DTOs.BedManagement;

namespace HospitalERP.Application.Interfaces;

public interface IBedManagementService
{
    // Wards
    Task<PagedResult<WardDto>> GetWardsAsync(int page, int pageSize, string search);
    Task<WardDto> GetWardByIdAsync(int id);
    Task<WardDto> CreateWardAsync(CreateWardDto dto, string userId);
    Task UpdateWardAsync(int id, CreateWardDto dto, string userId);
    Task DeleteWardAsync(int id, string userId);
    
    // Rooms
    Task<PagedResult<RoomDto>> GetRoomsAsync(int wardId, int page, int pageSize, string search);
    Task<RoomDto> GetRoomByIdAsync(int id);
    Task<RoomDto> CreateRoomAsync(CreateRoomDto dto, string userId);
    Task UpdateRoomAsync(int id, CreateRoomDto dto, string userId);
    Task DeleteRoomAsync(int id, string userId);
    
    // Beds
    Task<PagedResult<BedDto>> GetBedsAsync(int? wardId, int? roomId, string? status, int page, int pageSize, string search);
    Task<BedDto> GetBedByIdAsync(int id);
    Task<BedDto> CreateBedAsync(CreateBedDto dto, string userId);
    Task UpdateBedAsync(int id, CreateBedDto dto, string userId);
    Task DeleteBedAsync(int id, string userId);
    
    // Admissions
    Task<PagedResult<BedAdmissionDto>> GetAdmissionsAsync(int? patientId, string? status, int page, int pageSize);
    Task<BedAdmissionDto> GetAdmissionByIdAsync(int id);
    Task<BedAdmissionDto> AdmitPatientAsync(AdmitPatientDto dto, string userId);
    Task DischargePatientAsync(int admissionId, DischargePatientDto dto, string userId);
    Task TransferPatientAsync(int admissionId, int newBedId, string userId);
}
