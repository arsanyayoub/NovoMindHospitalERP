using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class DentalChart : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public string TeethStatusJson { get; set; } = string.Empty; // Serialized state of all 32 teeth
    public string? OverallNotes { get; set; }
    
    public ICollection<DentalProcedure> Procedures { get; set; } = new List<DentalProcedure>();
}

public class DentalProcedure : BaseEntity
{
    public int DentalChartId { get; set; }
    public DentalChart DentalChart { get; set; } = null!;

    public int ToothNumber { get; set; } // 1-32 or 11-48 FDI
    public string ProcedureType { get; set; } = string.Empty; // Filling, Root Canal, Extraction, Bridge, Crown
    public string Surfaces { get; set; } = string.Empty; // MO, DO, MOD, etc.
    
    public decimal Cost { get; set; }
    public DateTime ProcedureDate { get; set; }
    
    public int DentistId { get; set; }
    public Doctor Dentist { get; set; } = null!;

    public string? ClinicNotes { get; set; }
}

public class OrthodonticCase : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public string CaseType { get; set; } = string.Empty; // Braces, Invisalign, Retainer
    public DateTime StartDate { get; set; }
    public DateTime? ExpectedCompletionDate { get; set; }
    public decimal TotalAgreedCost { get; set; }
    public string Status { get; set; } = "Active"; // Active, OnHold, Completed
}
