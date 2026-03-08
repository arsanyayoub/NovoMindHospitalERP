using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class DietPlan : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public string DietType { get; set; } = "Regular"; // Regular, Diabetic, Renal, Soft, Liquid, NPO
    public string Allergies { get; set; } = string.Empty;
    public string RestrictedItems { get; set; } = string.Empty;
    
    public string? SpecialInstructions { get; set; }
    public bool IsActive { get; set; } = true;

    public int? PrescribedById { get; set; } // Doctor or Dietitian
    public Doctor? PrescribedBy { get; set; }
}

public class MealOrder : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public DateTime OrderDate { get; set; }
    public string MealType { get; set; } = "Breakfast"; // Breakfast, Lunch, Dinner, Snack
    public string ItemsOrdered { get; set; } = string.Empty;
    
    public string Status { get; set; } = "Pending"; // Pending, Preparing, OutForDelivery, Delivered, Cancelled
    public DateTime? DeliveryTime { get; set; }
    public string? DeliveredBy { get; set; }
    
    public string? PatientFeedback { get; set; } // Good, Cold, etc.
}

public class KitchenStock : BaseEntity
{
    public string IngredientName { get; set; } = string.Empty;
    public decimal CurrentQuantity { get; set; }
    public string Unit { get; set; } = "kg";
    public decimal ReorderLevel { get; set; }
}
