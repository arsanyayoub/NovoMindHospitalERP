using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class Ambulance : BaseEntity
{
    [Required]
    public string VehicleNumber { get; set; } = string.Empty; // License Plate
    public string Model { get; set; } = string.Empty;
    public string Type { get; set; } = "ALS"; // ALS (Advanced Life Support), BLS (Basic)
    
    public string Status { get; set; } = "Available"; // Available, Dispatched, Maintenance, OffDuty
    public string? CurrentLocation { get; set; }
    
    public int? PrimaryDriverId { get; set; }
    public Employee? PrimaryDriver { get; set; }

    public double LastOdometerReading { get; set; }
    public ICollection<AmbulanceDispatch> Dispatches { get; set; } = new List<AmbulanceDispatch>();
}

public class AmbulanceDispatch : BaseEntity
{
    public int AmbulanceId { get; set; }
    public Ambulance Ambulance { get; set; } = null!;

    public int? EmergencyAdmissionId { get; set; } // Link to ER case if applicable
    public EmergencyAdmission? EmergencyAdmission { get; set; }

    public string CallSource { get; set; } = string.Empty; // 123, Direct Call, External Referral
    public string PickupLocation { get; set; } = string.Empty;
    public string DestinationLocation { get; set; } = "Hospital ER";

    public DateTime DispatchTime { get; set; }
    public DateTime? ArrivalAtScentTime { get; set; }
    public DateTime? ArrivalAtHospitalTime { get; set; }

    public string? PatientConditionOnPickup { get; set; }
    public string? Outcome { get; set; } // Stabilized, Transferred, Dead on Arrival
}

public class FleetMaintenance : BaseEntity
{
    public int AmbulanceId { get; set; }
    public Ambulance Ambulance { get; set; } = null!;

    public string MaintenanceType { get; set; } = "Routine"; // Routine, Repair, Inspection
    public DateTime MaintenanceDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public string PerformedBy { get; set; } = string.Empty; // External Workshop or Internal Tech
}
