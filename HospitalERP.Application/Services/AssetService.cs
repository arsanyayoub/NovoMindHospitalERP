using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class AssetService : IAssetService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notifications;

    public AssetService(IUnitOfWork uow, INotificationService notifications)
    {
        _uow = uow;
        _notifications = notifications;
    }

    public async Task<PagedResult<AssetDto>> GetAssetsAsync(PagedRequest request, string? category = null, string? status = null, bool? isBioMedical = null)
    {
        var query = _uow.Assets.Query();
        if (!string.IsNullOrEmpty(category)) query = query.Where(a => a.Category == category);
        if (!string.IsNullOrEmpty(status)) query = query.Where(a => a.Status == status);
        if (isBioMedical.HasValue) query = query.Where(a => a.IsBioMedical == isBioMedical.Value);
        if (!string.IsNullOrEmpty(request.Search)) query = query.Where(a => a.AssetName.Contains(request.Search) || a.AssetCode.Contains(request.Search) || (a.SerialNumber != null && a.SerialNumber.Contains(request.Search)));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => MapToDto(a))
            .ToListAsync();

        return new PagedResult<AssetDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<AssetDto?> GetAssetByIdAsync(int id)
    {
        var a = await _uow.Assets.GetByIdAsync(id);
        return a == null ? null : MapToDto(a);
    }

    public async Task<AssetDto> CreateAssetAsync(CreateAssetDto dto, string userId)
    {
        var asset = new Asset
        {
            AssetName = dto.AssetName,
            AssetCode = $"AST-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}",
            Manufacturer = dto.Manufacturer,
            ModelNumber = dto.ModelNumber,
            SerialNumber = dto.SerialNumber,
            Category = dto.Category,
            PurchaseCost = dto.PurchaseCost,
            PurchaseDate = dto.PurchaseDate,
            WarrantyExpiryDate = dto.WarrantyExpiryDate,
            DepreciationRate = dto.DepreciationRate,
            CurrentValue = dto.PurchaseCost,
            Location = dto.Location,
            IsBioMedical = dto.IsBioMedical,
            MaintenanceIntervalDays = dto.MaintenanceIntervalDays,
            Notes = dto.Notes,
            Status = "Active",
            CreatedBy = userId,
            CreatedDate = DateTime.UtcNow
        };

        if (asset.MaintenanceIntervalDays.HasValue)
        {
            asset.NextMaintenanceDate = asset.PurchaseDate.AddDays(asset.MaintenanceIntervalDays.Value);
        }

        await _uow.Assets.AddAsync(asset);
        await _uow.SaveChangesAsync();
        return MapToDto(asset);
    }

    public async Task<AssetDto> UpdateAssetAsync(int id, CreateAssetDto dto, string userId)
    {
        var asset = await _uow.Assets.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        asset.AssetName = dto.AssetName;
        asset.Manufacturer = dto.Manufacturer;
        asset.ModelNumber = dto.ModelNumber;
        asset.SerialNumber = dto.SerialNumber;
        asset.Category = dto.Category;
        asset.PurchaseCost = dto.PurchaseCost;
        asset.PurchaseDate = dto.PurchaseDate;
        asset.WarrantyExpiryDate = dto.WarrantyExpiryDate;
        asset.DepreciationRate = dto.DepreciationRate;
        asset.Location = dto.Location;
        asset.IsBioMedical = dto.IsBioMedical;
        asset.MaintenanceIntervalDays = dto.MaintenanceIntervalDays;
        asset.Notes = dto.Notes;
        asset.UpdatedBy = userId;
        asset.UpdatedDate = DateTime.UtcNow;

        if (asset.MaintenanceIntervalDays.HasValue && !asset.LastMaintenanceDate.HasValue)
        {
            asset.NextMaintenanceDate = asset.PurchaseDate.AddDays(asset.MaintenanceIntervalDays.Value);
        }

        _uow.Assets.Update(asset);
        await _uow.SaveChangesAsync();
        return MapToDto(asset);
    }

    public async Task DeleteAssetAsync(int id, string userId)
    {
        var asset = await _uow.Assets.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        asset.IsDeleted = true;
        asset.UpdatedBy = userId;
        asset.UpdatedDate = DateTime.UtcNow;
        _uow.Assets.Update(asset);
        await _uow.SaveChangesAsync();
    }

    // --- Maintenance Tickets ---
    public async Task<PagedResult<MaintenanceTicketDto>> GetMaintenanceTicketsAsync(PagedRequest request, int? assetId = null, string? status = null, string? type = null)
    {
        var query = _uow.MaintenanceTickets.Query().Include(t => t.Asset).AsQueryable();
        if (assetId.HasValue) query = query.Where(t => t.AssetId == assetId.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(t => t.Status == status);
        if (!string.IsNullOrEmpty(type)) query = query.Where(t => t.Type == type);
        if (!string.IsNullOrEmpty(request.Search)) query = query.Where(t => t.TicketNumber.Contains(request.Search) || t.Description.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(t => t.ReportedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => MapTicketToDto(t))
            .ToListAsync();

        return new PagedResult<MaintenanceTicketDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<MaintenanceTicketDto?> GetTicketByIdAsync(int id)
    {
        var t = await _uow.MaintenanceTickets.Query().Include(x => x.Asset).FirstOrDefaultAsync(x => x.Id == id);
        return t == null ? null : MapTicketToDto(t);
    }

    public async Task<MaintenanceTicketDto> CreateTicketAsync(CreateMaintenanceTicketDto dto, string userId)
    {
        var asset = await _uow.Assets.GetByIdAsync(dto.AssetId) ?? throw new KeyNotFoundException();
        var ticket = new MaintenanceTicket
        {
            AssetId = dto.AssetId,
            TicketNumber = $"MNT-{DateTime.UtcNow:yyyyMM}-{new Random().Next(100, 999)}",
            Type = dto.Type,
            Priority = dto.Priority,
            Description = dto.Description,
            Status = "Open",
            ReportedBy = dto.ReportedBy,
            TechnicianName = dto.TechnicianName,
            Cost = dto.Cost,
            Notes = dto.Notes,
            ReportedDate = DateTime.UtcNow,
            CreatedBy = userId,
            CreatedDate = DateTime.UtcNow
        };

        if (ticket.Type == "Corrective")
        {
            asset.Status = "Maintenance";
            _uow.Assets.Update(asset);
        }

        await _uow.MaintenanceTickets.AddAsync(ticket);
        await _uow.SaveChangesAsync();

        // Notify Bio-medical or Facility head if high priority
        if (ticket.Priority == "High" || ticket.Priority == "Emergency")
        {
            await _notifications.CreateNotificationAsync(
                $"Urgent {ticket.Type} Maintenance",
                $"{ticket.Priority} priority ticket {ticket.TicketNumber} reported for {asset.AssetName}.",
                "Maintenance",
                null, // All relevant roles
                "Asset",
                asset.Id);
        }

        return MapTicketToDto(ticket);
    }

    public async Task<MaintenanceTicketDto> UpdateTicketStatusAsync(int id, UpdateMaintenanceTicketDto dto, string userId)
    {
        var ticket = await _uow.MaintenanceTickets.Query().Include(x => x.Asset).FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException();
        
        var oldStatus = ticket.Status;
        ticket.Status = dto.Status;
        ticket.CompletedDate = dto.CompletedDate;
        ticket.TechnicianName = dto.TechnicianName;
        ticket.Cost = dto.Cost;
        ticket.Resolution = dto.Resolution;
        ticket.Notes = dto.Notes;
        ticket.UpdatedBy = userId;
        ticket.UpdatedDate = DateTime.UtcNow;

        if (ticket.Status == "Completed" && oldStatus != "Completed")
        {
            ticket.Asset.Status = "Active";
            ticket.Asset.LastMaintenanceDate = ticket.CompletedDate ?? DateTime.UtcNow;
            if (ticket.Asset.MaintenanceIntervalDays.HasValue)
            {
                ticket.Asset.NextMaintenanceDate = ticket.Asset.LastMaintenanceDate.Value.AddDays(ticket.Asset.MaintenanceIntervalDays.Value);
            }
            _uow.Assets.Update(ticket.Asset);
        }

        _uow.MaintenanceTickets.Update(ticket);
        await _uow.SaveChangesAsync();
        return MapTicketToDto(ticket);
    }

    private static AssetDto MapToDto(Asset a) => new AssetDto(
        a.Id, a.AssetCode, a.AssetName, a.Manufacturer, a.ModelNumber, a.SerialNumber, a.Category, a.PurchaseCost, a.PurchaseDate, a.WarrantyExpiryDate, a.DepreciationRate, a.CurrentValue, a.Location, a.Status, a.IsBioMedical, a.MaintenanceIntervalDays, a.LastMaintenanceDate, a.NextMaintenanceDate, a.Notes);

    private static MaintenanceTicketDto MapTicketToDto(MaintenanceTicket t) => new MaintenanceTicketDto(
        t.Id, t.AssetId, t.Asset?.AssetName ?? "Unknown", t.TicketNumber, t.Type, t.Priority, t.Description, t.Status, t.ReportedDate, t.CompletedDate, t.ReportedBy, t.TechnicianName, t.Cost, t.Resolution, t.Notes);
}
