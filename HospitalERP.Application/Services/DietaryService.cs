using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class DietaryService : IDietaryService
{
    private readonly IUnitOfWork _uow;

    public DietaryService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<DietPlanDto?> GetPlanByPatientAsync(int patientId)
    {
        var plan = await _uow.DietPlans.Query()
            .Include(p => p.Patient)
            .FirstOrDefaultAsync(p => p.PatientId == patientId && p.IsActive);

        if (plan == null) return null;

        return new DietPlanDto(plan.Id, plan.PatientId, plan.Patient.FullName, plan.DietType, plan.IsActive);
    }

    public async Task<DietPlanDto> CreateDietPlanAsync(CreateDietPlanDto dto, string userId)
    {
        // Deactivate old active plan
        var oldPlans = await _uow.DietPlans.Query().Where(p => p.PatientId == dto.PatientId && p.IsActive).ToListAsync();
        foreach (var op in oldPlans) op.IsActive = false;

        var plan = new DietPlan
        {
            PatientId = dto.PatientId,
            DietType = dto.DietType,
            Allergies = dto.Allergies,
            RestrictedItems = dto.RestrictedItems,
            SpecialInstructions = dto.SpecialInstructions,
            PrescribedById = dto.PrescribedById,
            CreatedBy = userId
        };

        await _uow.DietPlans.AddAsync(plan);
        await _uow.SaveChangesAsync();

        var p = await _uow.Patients.GetByIdAsync(dto.PatientId);
        return new DietPlanDto(plan.Id, plan.PatientId, p?.FullName ?? "", plan.DietType, plan.IsActive);
    }

    public async Task<PagedResult<MealOrderDto>> GetMealOrdersAsync(PagedRequest request, string? status = null)
    {
        IQueryable<MealOrder> query = _uow.MealOrders.Query().Include(o => o.Patient);
        if (!string.IsNullOrEmpty(status)) query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(o => o.OrderDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(o => new MealOrderDto(o.Id, o.PatientId, o.Patient.FullName, o.MealType, o.Status, o.OrderDate))
            .ToListAsync();

        return new PagedResult<MealOrderDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<MealOrderDto> CreateMealOrderAsync(CreateMealOrderDto dto, string userId)
    {
        var order = new MealOrder
        {
            PatientId = dto.PatientId,
            MealType = dto.MealType,
            ItemsOrdered = dto.ItemsOrdered,
            OrderDate = DateTime.UtcNow,
            CreatedBy = userId
        };

        await _uow.MealOrders.AddAsync(order);
        await _uow.SaveChangesAsync();

        var p = await _uow.Patients.GetByIdAsync(dto.PatientId);
        return new MealOrderDto(order.Id, order.PatientId, p?.FullName ?? "", order.MealType, order.Status, order.OrderDate);
    }

    public async Task UpdateMealOrderStatusAsync(int id, string status, string userId)
    {
        var order = await _uow.MealOrders.GetByIdAsync(id);
        if (order != null)
        {
            order.Status = status;
            if (status == "Delivered") order.DeliveryTime = DateTime.UtcNow;
            order.UpdatedBy = userId;
            order.UpdatedDate = DateTime.UtcNow;
            _uow.MealOrders.Update(order);
            await _uow.SaveChangesAsync();
        }
    }
}
