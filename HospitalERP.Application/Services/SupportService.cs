using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class SupportService : ISupportService
{
    private readonly IUnitOfWork _uow;

    public SupportService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    // ===== CSSD =====
    public async Task<PagedResult<SterilizationBatchDto>> GetSterilizationBatchesAsync(PagedRequest request)
    {
        var query = _uow.SterilizationBatches.Query().Include(b => b.Items);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(b => b.CycleStartTime)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(b => new SterilizationBatchDto(
                b.Id, b.BatchNumber, b.EquipmentName, b.CycleStartTime, b.CycleEndTime, b.Status, b.OperatorName,
                b.Items.Select(i => new SterilizedItemDto(i.ItemName, i.ContainerId, i.ExpiryDate, i.IsBiologicalIndicatorPassed))
            ))
            .ToListAsync();
            
        return new PagedResult<SterilizationBatchDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<SterilizationBatchDto> CreateSterilizationBatchAsync(CreateSterilizationBatchDto dto, string userId)
    {
        var batch = new SterilizationBatch
        {
            BatchNumber = dto.BatchNumber,
            EquipmentName = dto.EquipmentName,
            OperatorName = dto.OperatorName,
            CycleStartTime = DateTime.UtcNow,
            Status = "InService",
            CreatedBy = userId
        };

        foreach (var itemName in dto.ItemNames)
        {
            batch.Items.Add(new SterilizedItem
            {
                ItemName = itemName,
                ContainerId = "C-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                ExpiryDate = DateTime.UtcNow.AddDays(30),
                CreatedBy = userId
            });
        }

        await _uow.SterilizationBatches.AddAsync(batch);
        await _uow.SaveChangesAsync();

        return new SterilizationBatchDto(
            batch.Id, batch.BatchNumber, batch.EquipmentName, batch.CycleStartTime, batch.CycleEndTime, batch.Status, batch.OperatorName,
            batch.Items.Select(i => new SterilizedItemDto(i.ItemName, i.ContainerId, i.ExpiryDate, i.IsBiologicalIndicatorPassed))
        );
    }

    // ===== MORTUARY =====
    public async Task<PagedResult<DeceasedRecordDto>> GetDeceasedRecordsAsync(PagedRequest request)
    {
        var query = _uow.DeceasedRecords.Query();
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.DateOfDeath)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(r => new DeceasedRecordDto(
                r.Id, r.Name, r.DateOfDeath, r.CauseOfDeath, r.BodyStatus, r.ChamberNumber, r.ReceivedDate, r.ReleasedDate
            ))
            .ToListAsync();

        return new PagedResult<DeceasedRecordDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<DeceasedRecordDto> RecordDeathAsync(CreateDeceasedRecordDto dto, string userId)
    {
        var record = new DeceasedRecord
        {
            PatientId = dto.PatientId,
            Name = dto.Name,
            DateOfDeath = dto.DateOfDeath,
            CauseOfDeath = dto.CauseOfDeath,
            ChamberNumber = dto.ChamberNumber,
            BodyStatus = "InMortuary",
            ReceivedDate = DateTime.UtcNow,
            CreatedBy = userId
        };

        await _uow.DeceasedRecords.AddAsync(record);
        await _uow.SaveChangesAsync();

        return new DeceasedRecordDto(
            record.Id, record.Name, record.DateOfDeath, record.CauseOfDeath, record.BodyStatus, record.ChamberNumber, record.ReceivedDate, record.ReleasedDate
        );
    }
}
