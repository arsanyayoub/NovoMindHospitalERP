using HospitalERP.Application.DTOs;

namespace HospitalERP.Application.Interfaces;

public interface ISurgeryBillingService
{
    Task<int> GenerateSurgeryBillAsync(int surgeryId, string userId);
    Task<decimal> CalculateSurgeryCostAsync(int surgeryId);
}
