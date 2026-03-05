using HospitalERP.Application.DTOs;
using HospitalERP.Application.DTOs.BedManagement;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class BedManagementService : IBedManagementService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;

    public BedManagementService(IUnitOfWork uow, IAuditLogService auditLog)
    {
        _uow = uow;
        _auditLog = auditLog;
    }

    public async Task<PagedResult<WardDto>> GetWardsAsync(int page, int pageSize, string search)
    {
        var query = _uow.Wards.Query()
            .Include(w => w.Rooms).ThenInclude(r => r.Beds).ThenInclude(b => b.Admissions)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            query = query.Where(w => w.WardName.ToLower().Contains(search) || w.WardCode.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(w => new WardDto
            {
                Id = w.Id,
                WardCode = w.WardCode,
                WardName = w.WardName,
                WardNameAr = w.WardNameAr,
                WardType = w.WardType,
                FloorNumber = w.FloorNumber,
                Description = w.Description,
                IsActive = w.IsActive,
                TotalRooms = w.Rooms.Count(r => !r.IsDeleted),
                TotalBeds = w.Rooms.Where(r => !r.IsDeleted).SelectMany(r => r.Beds).Count(b => !b.IsDeleted),
                OccupiedBeds = w.Rooms.Where(r => !r.IsDeleted).SelectMany(r => r.Beds)
                    .Count(b => !b.IsDeleted && b.Status == "Occupied")
            })
            .ToListAsync();

        return new PagedResult<WardDto>(data, total, page, pageSize);
    }

    public async Task<WardDto> GetWardByIdAsync(int id)
    {
        var w = await _uow.Wards.Query().Include(w => w.Rooms).ThenInclude(r => r.Beds).FirstOrDefaultAsync(x => x.Id == id);
        if (w == null) throw new KeyNotFoundException("Ward not found");
        
        return new WardDto
        {
            Id = w.Id, WardCode = w.WardCode, WardName = w.WardName, WardNameAr = w.WardNameAr,
            WardType = w.WardType, FloorNumber = w.FloorNumber, Description = w.Description, IsActive = w.IsActive,
            TotalRooms = w.Rooms.Count(r => !r.IsDeleted),
            TotalBeds = w.Rooms.Where(r => !r.IsDeleted).SelectMany(r => r.Beds).Count(b => !b.IsDeleted),
            OccupiedBeds = w.Rooms.Where(r => !r.IsDeleted).SelectMany(r => r.Beds)
                .Count(b => !b.IsDeleted && b.Status == "Occupied")
        };
    }

    public async Task<WardDto> CreateWardAsync(CreateWardDto dto, string userId)
    {
        var w = new Ward
        {
            WardCode = dto.WardCode, WardName = dto.WardName, WardNameAr = dto.WardNameAr,
            WardType = dto.WardType, FloorNumber = dto.FloorNumber, Description = dto.Description,
            IsActive = dto.IsActive, CreatedBy = userId
        };
        await _uow.Wards.AddAsync(w);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "Ward", w.Id, $"Ward {w.WardName} ({w.WardCode}) created.");
        return await GetWardByIdAsync(w.Id);
    }

    public async Task UpdateWardAsync(int id, CreateWardDto dto, string userId)
    {
        var w = await _uow.Wards.GetByIdAsync(id) ?? throw new KeyNotFoundException("Ward not found");
        w.WardName = dto.WardName; w.WardNameAr = dto.WardNameAr; w.WardCode = dto.WardCode;
        w.WardType = dto.WardType; w.FloorNumber = dto.FloorNumber; w.Description = dto.Description;
        w.IsActive = dto.IsActive; w.UpdatedBy = userId; w.UpdatedDate = DateTime.UtcNow;
        _uow.Wards.Update(w);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "Ward", w.Id, $"Ward {w.WardName} updated.");
    }

    public async Task DeleteWardAsync(int id, string userId)
    {
        var w = await _uow.Wards.GetByIdAsync(id) ?? throw new KeyNotFoundException("Ward not found");
        w.UpdatedBy = userId; w.UpdatedDate = DateTime.UtcNow;
        _uow.Wards.SoftDelete(w);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Delete", "Ward", w.Id, $"Ward {w.WardName} soft-deleted.");
    }

    public async Task<PagedResult<RoomDto>> GetRoomsAsync(int wardId, int page, int pageSize, string search)
    {
        var query = _uow.Rooms.Query()
            .Include(r => r.Ward)
            .Include(r => r.Beds)
            .Where(r => r.WardId == wardId);

        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            query = query.Where(r => r.RoomNumber.ToLower().Contains(search) || r.RoomType.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new RoomDto
            {
                Id = r.Id, WardId = r.WardId, WardName = r.Ward.WardName,
                RoomNumber = r.RoomNumber, RoomType = r.RoomType,
                Capacity = r.Capacity, IsActive = r.IsActive, Notes = r.Notes,
                OccupiedBeds = r.Beds.Count(b => !b.IsDeleted && b.Status == "Occupied")
            })
            .ToListAsync();

        return new PagedResult<RoomDto>(data, total, page, pageSize);
    }

    public async Task<RoomDto> GetRoomByIdAsync(int id)
    {
        var r = await _uow.Rooms.Query().Include(r => r.Ward).Include(r => r.Beds).FirstOrDefaultAsync(x => x.Id == id);
        if (r == null) throw new KeyNotFoundException("Room not found");
        return new RoomDto
        {
             Id = r.Id, WardId = r.WardId, WardName = r.Ward.WardName,
             RoomNumber = r.RoomNumber, RoomType = r.RoomType,
             Capacity = r.Capacity, IsActive = r.IsActive, Notes = r.Notes,
             OccupiedBeds = r.Beds.Count(b => !b.IsDeleted && b.Status == "Occupied")
        };
    }

    public async Task<RoomDto> CreateRoomAsync(CreateRoomDto dto, string userId)
    {
        var r = new Room
        {
            WardId = dto.WardId, RoomNumber = dto.RoomNumber, RoomType = dto.RoomType,
            Capacity = dto.Capacity, IsActive = dto.IsActive, Notes = dto.Notes, CreatedBy = userId
        };
        await _uow.Rooms.AddAsync(r);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "Room", r.Id, $"Room {r.RoomNumber} in Ward ID {r.WardId} created.");
        return await GetRoomByIdAsync(r.Id);
    }

    public async Task UpdateRoomAsync(int id, CreateRoomDto dto, string userId)
    {
        var r = await _uow.Rooms.GetByIdAsync(id) ?? throw new KeyNotFoundException("Room not found");
        r.WardId = dto.WardId; r.RoomNumber = dto.RoomNumber; r.RoomType = dto.RoomType;
        r.Capacity = dto.Capacity; r.IsActive = dto.IsActive; r.Notes = dto.Notes;
        r.UpdatedBy = userId; r.UpdatedDate = DateTime.UtcNow;
        _uow.Rooms.Update(r);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "Room", r.Id, $"Room {r.RoomNumber} updated.");
    }

    public async Task DeleteRoomAsync(int id, string userId)
    {
        var r = await _uow.Rooms.GetByIdAsync(id) ?? throw new KeyNotFoundException("Room not found");
        r.UpdatedBy = userId; r.UpdatedDate = DateTime.UtcNow;
        _uow.Rooms.SoftDelete(r);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Delete", "Room", r.Id, $"Room {r.RoomNumber} soft-deleted.");
    }

    public async Task<PagedResult<BedDto>> GetBedsAsync(int? wardId, int? roomId, string? status, int page, int pageSize, string search)
    {
        var query = _uow.Beds.Query()
            .Include(b => b.Room).ThenInclude(r => r.Ward)
            .Include(b => b.Admissions.Where(a => a.Status == "Active")).ThenInclude(a => a.Patient)
            .AsQueryable();

        if (wardId.HasValue) query = query.Where(b => b.Room.WardId == wardId.Value);
        if (roomId.HasValue) query = query.Where(b => b.RoomId == roomId.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(b => b.Status == status);

        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            query = query.Where(b => b.BedNumber.ToLower().Contains(search) || b.Room.RoomNumber.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(b => new BedDto
            {
                Id = b.Id, RoomId = b.RoomId, RoomNumber = b.Room.RoomNumber,
                WardId = b.Room.WardId, WardName = b.Room.Ward.WardName,
                BedNumber = b.BedNumber, Status = b.Status,
                CurrentAdmissionId = b.Admissions.FirstOrDefault() != null ? b.Admissions.First().Id : null,
                PatientName = b.Admissions.FirstOrDefault() != null ? b.Admissions.First().Patient.FullName : null,
                PatientCode = b.Admissions.FirstOrDefault() != null ? b.Admissions.First().Patient.PatientCode : null
            })
            .ToListAsync();

        return new PagedResult<BedDto>(data, total, page, pageSize);
    }

    public async Task<BedDto> GetBedByIdAsync(int id)
    {
        var b = await _uow.Beds.Query()
            .Include(b => b.Room).ThenInclude(r => r.Ward)
            .Include(b => b.Admissions.Where(a => a.Status == "Active")).ThenInclude(a => a.Patient)
            .FirstOrDefaultAsync(x => x.Id == id);
        
        if (b == null) throw new KeyNotFoundException("Bed not found");
        return new BedDto
        {
            Id = b.Id, RoomId = b.RoomId, RoomNumber = b.Room.RoomNumber,
            WardId = b.Room.WardId, WardName = b.Room.Ward.WardName,
            BedNumber = b.BedNumber, Status = b.Status,
            CurrentAdmissionId = b.Admissions.FirstOrDefault() != null ? b.Admissions.First().Id : null,
            PatientName = b.Admissions.FirstOrDefault() != null ? b.Admissions.First().Patient.FullName : null,
            PatientCode = b.Admissions.FirstOrDefault() != null ? b.Admissions.First().Patient.PatientCode : null
        };
    }

    public async Task<BedDto> CreateBedAsync(CreateBedDto dto, string userId)
    {
        var room = await _uow.Rooms.Query().Include(r => r.Beds).FirstOrDefaultAsync(r => r.Id == dto.RoomId);
        if (room == null) throw new KeyNotFoundException("Room not found");
        
        if(room.Beds.Count(b => !b.IsDeleted) >= room.Capacity) {
             throw new InvalidOperationException("Room is at full capacity. Cannot add another bed.");
        }

        var b = new Bed
        {
            RoomId = dto.RoomId, BedNumber = dto.BedNumber, Status = dto.Status, CreatedBy = userId
        };
        await _uow.Beds.AddAsync(b);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "Bed", b.Id, $"Bed {b.BedNumber} in Room ID {b.RoomId} created.");
        return await GetBedByIdAsync(b.Id);
    }

    public async Task UpdateBedAsync(int id, CreateBedDto dto, string userId)
    {
        var b = await _uow.Beds.GetByIdAsync(id) ?? throw new KeyNotFoundException("Bed not found");
        b.RoomId = dto.RoomId; b.BedNumber = dto.BedNumber; b.Status = dto.Status;
        b.UpdatedBy = userId; b.UpdatedDate = DateTime.UtcNow;
        _uow.Beds.Update(b);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "Bed", b.Id, $"Bed {b.BedNumber} updated (Status: {b.Status}).");
    }

    public async Task DeleteBedAsync(int id, string userId)
    {
        var b = await _uow.Beds.Query().Include(x => x.Admissions.Where(a => a.Status == "Active")).FirstOrDefaultAsync(x => x.Id == id);
        if (b == null) throw new KeyNotFoundException("Bed not found");
        if (b.Admissions.Any()) throw new InvalidOperationException("Cannot delete a bed that has an active patient admission.");
        
        b.UpdatedBy = userId; b.UpdatedDate = DateTime.UtcNow;
        _uow.Beds.SoftDelete(b);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Delete", "Bed", b.Id, $"Bed {b.BedNumber} soft-deleted.");
    }

    public async Task<PagedResult<BedAdmissionDto>> GetAdmissionsAsync(int? patientId, string? status, int page, int pageSize)
    {
        var query = _uow.BedAdmissions.Query()
            .Include(a => a.Bed).ThenInclude(b => b.Room).ThenInclude(r => r.Ward)
            .Include(a => a.Patient)
            .Include(a => a.Doctor).ThenInclude(d => d.Employee)
            .OrderByDescending(a => a.AdmissionDate)
            .AsQueryable();

        if (patientId.HasValue) query = query.Where(a => a.PatientId == patientId.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(a => a.Status == status);

        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(a => new BedAdmissionDto
            {
                Id = a.Id, BedId = a.BedId, BedNumber = a.Bed.BedNumber,
                RoomNumber = a.Bed.Room.RoomNumber, WardName = a.Bed.Room.Ward.WardName,
                PatientId = a.PatientId, PatientCode = a.Patient.PatientCode,
                PatientName = a.Patient.FullName,
                DoctorId = a.DoctorId,
                DoctorName = a.Doctor != null ? "Dr. " + a.Doctor.Employee.FullName : null,
                AdmissionDate = a.AdmissionDate, DischargeDate = a.DischargeDate,
                AdmissionType = a.AdmissionType, Status = a.Status, AdmissionReason = a.AdmissionReason,
                DischargeNotes = a.DischargeNotes, DailyRate = a.DailyRate, Notes = a.Notes
            })
            .ToListAsync();

        return new PagedResult<BedAdmissionDto>(data, total, page, pageSize);
    }

    public async Task<BedAdmissionDto> GetAdmissionByIdAsync(int id)
    {
        var a = await _uow.BedAdmissions.Query()
            .Include(a => a.Bed).ThenInclude(b => b.Room).ThenInclude(r => r.Ward)
            .Include(a => a.Patient)
            .Include(a => a.Doctor).ThenInclude(d => d.Employee)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (a == null) throw new KeyNotFoundException("Admission not found");
        
        return new BedAdmissionDto
        {
            Id = a.Id, BedId = a.BedId, BedNumber = a.Bed.BedNumber,
            RoomNumber = a.Bed.Room.RoomNumber, WardName = a.Bed.Room.Ward.WardName,
            PatientId = a.PatientId, PatientCode = a.Patient.PatientCode,
            PatientName = a.Patient.FullName,
            DoctorId = a.DoctorId,
            DoctorName = a.Doctor != null ? "Dr. " + a.Doctor.Employee.FullName : null,
            AdmissionDate = a.AdmissionDate, DischargeDate = a.DischargeDate,
            AdmissionType = a.AdmissionType, Status = a.Status, AdmissionReason = a.AdmissionReason,
            DischargeNotes = a.DischargeNotes, DailyRate = a.DailyRate, Notes = a.Notes
        };
    }

    public async Task<BedAdmissionDto> AdmitPatientAsync(AdmitPatientDto dto, string userId)
    {
        var bed = await _uow.Beds.GetByIdAsync(dto.BedId);
        if (bed == null) throw new KeyNotFoundException("Bed not found");
        if (bed.Status != "Available") throw new InvalidOperationException("Bed is not available");

        var activeAdmissions = await _uow.BedAdmissions.Query().AnyAsync(a => a.PatientId == dto.PatientId && a.Status == "Active");
        if (activeAdmissions) throw new InvalidOperationException("Patient is already admitted to a bed.");

        var adm = new BedAdmission
        {
            BedId = dto.BedId, PatientId = dto.PatientId, DoctorId = dto.DoctorId,
            AdmissionDate = DateTime.UtcNow, AdmissionType = dto.AdmissionType,
            Status = "Active", AdmissionReason = dto.AdmissionReason,
            DailyRate = dto.DailyRate, Notes = dto.Notes, CreatedBy = userId
        };

        bed.Status = "Occupied";
        bed.UpdatedBy = userId; bed.UpdatedDate = DateTime.UtcNow;
        _uow.Beds.Update(bed);
        await _uow.BedAdmissions.AddAsync(adm);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Patient Admission", "BedAdmission", adm.Id, $"Patient ID {adm.PatientId} admitted to Bed {bed.BedNumber}.");
        return await GetAdmissionByIdAsync(adm.Id);
    }

    public async Task DischargePatientAsync(int admissionId, DischargePatientDto dto, string userId)
    {
        var adm = await _uow.BedAdmissions.Query().Include(a => a.Bed).FirstOrDefaultAsync(x => x.Id == admissionId);
        if (adm == null) throw new KeyNotFoundException("Admission not found");
        if (adm.Status != "Active") throw new InvalidOperationException("Admission is not active");

        adm.Status = "Discharged";
        adm.DischargeDate = DateTime.UtcNow;
        adm.DischargeNotes = dto.DischargeNotes;
        adm.UpdatedBy = userId; adm.UpdatedDate = DateTime.UtcNow;

        adm.Bed.Status = "Available"; // Assuming we make it available right away, or they need "Maintenance" depending on business rules.
        adm.Bed.UpdatedBy = userId; adm.Bed.UpdatedDate = DateTime.UtcNow;

        _uow.BedAdmissions.Update(adm);
        _uow.Beds.Update(adm.Bed);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Patient Discharge", "BedAdmission", adm.Id, $"Patient ID {adm.PatientId} discharged from Bed {adm.Bed.BedNumber}.");
    }

    public async Task TransferPatientAsync(int admissionId, int newBedId, string userId)
    {
        var adm = await _uow.BedAdmissions.Query().Include(a => a.Bed).FirstOrDefaultAsync(x => x.Id == admissionId);
        if (adm == null) throw new KeyNotFoundException("Admission not found");
        if (adm.Status != "Active") throw new InvalidOperationException("Admission is not active");

        if (adm.BedId == newBedId) throw new InvalidOperationException("Patient is already in this bed");

        var newBed = await _uow.Beds.GetByIdAsync(newBedId);
        if (newBed == null) throw new KeyNotFoundException("Target bed not found");
        if (newBed.Status != "Available") throw new InvalidOperationException("Target bed is not available");

        // Old bed becomes available
        adm.Bed.Status = "Available";
        adm.Bed.UpdatedBy = userId; adm.Bed.UpdatedDate = DateTime.UtcNow;
        _uow.Beds.Update(adm.Bed);

        // New bed becomes occupied
        newBed.Status = "Occupied";
        newBed.UpdatedBy = userId; newBed.UpdatedDate = DateTime.UtcNow;
        _uow.Beds.Update(newBed);

        // Update admission
        adm.BedId = newBedId;
        adm.UpdatedBy = userId; adm.UpdatedDate = DateTime.UtcNow;
        _uow.BedAdmissions.Update(adm);

        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Patient Transfer", "BedAdmission", adm.Id, $"Patient ID {adm.PatientId} transferred to Bed ID {newBedId}.");
    }
}
