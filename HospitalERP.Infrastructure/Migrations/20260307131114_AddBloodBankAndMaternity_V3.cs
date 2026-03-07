using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBloodBankAndMaternity_V3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InsuranceProvider",
                table: "Patients",
                newName: "InsuranceProviderNameManual");

            migrationBuilder.RenameColumn(
                name: "InsuranceCoverage",
                table: "Patients",
                newName: "InsuranceCoverageType");

            migrationBuilder.AddColumn<int>(
                name: "RadiologyTemplateId",
                table: "RadiologyResults",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmergencyAdmissionId",
                table: "RadiologyRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BedAdmissionId",
                table: "Prescriptions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmergencyAdmissionId",
                table: "Prescriptions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BedAdmissionId",
                table: "PatientVitals",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmergencyAdmissionId",
                table: "PatientVitals",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InsurancePlanId",
                table: "Patients",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InsuranceProviderId",
                table: "Patients",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCritical",
                table: "LabResults",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ResultFlag",
                table: "LabResults",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CollectedBy",
                table: "LabRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CollectionDate",
                table: "LabRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmergencyAdmissionId",
                table: "LabRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedAtLabDate",
                table: "LabRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DosageForm",
                table: "Items",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GenericName",
                table: "Items",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsNarcotic",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresRefrigeration",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Strength",
                table: "Items",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InsuranceShare",
                table: "Invoices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PatientShare",
                table: "Invoices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "BedAdmissionId",
                table: "ClinicalEncounters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmergencyAdmissionId",
                table: "ClinicalEncounters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmergencyAdmissionId",
                table: "BedAdmissions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsBioMedical",
                table: "Assets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastMaintenanceDate",
                table: "Assets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaintenanceIntervalDays",
                table: "Assets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Manufacturer",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModelNumber",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextMaintenanceDate",
                table: "Assets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SerialNumber",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyExpiryDate",
                table: "Assets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AttendanceRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClockIn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ClockOut = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendanceRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttendanceRecords_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BloodDonors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DonorCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BloodGroup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RhFactor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastDonationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsEligible = table.Column<bool>(type: "bit", nullable: false),
                    EligibilityNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodDonors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BloodRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    BloodGroupRequired = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RhFactorRequired = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ComponentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitsRequested = table.Column<int>(type: "int", nullable: false),
                    Urgency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClinicalIndication = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequestedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiredDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BloodRequests_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BloodStocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BagNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BloodGroup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RhFactor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ComponentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VolumeMl = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StorageLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReservedForPatientId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodStocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BloodStocks_Patients_ReservedForPatientId",
                        column: x => x.ReservedForPatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "EmergencyAdmissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    ArrivalTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ArrivalMode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChiefComplaint = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InitialVitalSigns = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TriageLevel = table.Column<int>(type: "int", nullable: true),
                    TriageCategory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TriageTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TriageNurseId = table.Column<int>(type: "int", nullable: true),
                    TriageNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignedDoctorId = table.Column<int>(type: "int", nullable: true),
                    ERBayNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Disposition = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DispositionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Diagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InpatientAdmissionId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmergencyAdmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmergencyAdmissions_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmergencyAdmissions_Users_AssignedDoctorId",
                        column: x => x.AssignedDoctorId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ERTriageVitals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmergencyAdmissionId = table.Column<int>(type: "int", nullable: false),
                    Temperature = table.Column<double>(type: "float", nullable: false),
                    BloodPressure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeartRate = table.Column<int>(type: "int", nullable: false),
                    RespiratoryRate = table.Column<int>(type: "int", nullable: false),
                    SpO2 = table.Column<int>(type: "int", nullable: false),
                    PainScale = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ERTriageVitals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InpatientNursingAssessments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BedAdmissionId = table.Column<int>(type: "int", nullable: false),
                    AssessmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecordedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Shift = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Neurological = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Respiratory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cardiovascular = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gastrointestinal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Genitourinary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Musculoskeletal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkinIntegumentary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Psychological = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NursingNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlanOfCare = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InpatientNursingAssessments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InpatientNursingAssessments_BedAdmissions_BedAdmissionId",
                        column: x => x.BedAdmissionId,
                        principalTable: "BedAdmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InsuranceProviders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactPerson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TPA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceProviders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LabTestReferenceRanges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LabTestId = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinAge = table.Column<int>(type: "int", nullable: true),
                    MaxAge = table.Column<int>(type: "int", nullable: true),
                    MinValue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaxValue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CriticalLow = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CriticalHigh = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabTestReferenceRanges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LabTestReferenceRanges_LabTests_LabTestId",
                        column: x => x.LabTestId,
                        principalTable: "LabTests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceTickets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetId = table.Column<int>(type: "int", nullable: false),
                    TicketNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReportedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReportedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TechnicianName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Resolution = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceTickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaintenanceTickets_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicationAdministrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrescriptionItemId = table.Column<int>(type: "int", nullable: false),
                    BedAdmissionId = table.Column<int>(type: "int", nullable: false),
                    AdministeredDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AdministeredBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dose = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationAdministrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_BedAdmissions_BedAdmissionId",
                        column: x => x.BedAdmissionId,
                        principalTable: "BedAdmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_PrescriptionItems_PrescriptionItemId",
                        column: x => x.PrescriptionItemId,
                        principalTable: "PrescriptionItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicineInteractions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemAId = table.Column<int>(type: "int", nullable: false),
                    ItemBId = table.Column<int>(type: "int", nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InteractionDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Recommendation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicineInteractions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicineInteractions_Items_ItemAId",
                        column: x => x.ItemAId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicineInteractions_Items_ItemBId",
                        column: x => x.ItemBId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicineReturns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrescriptionItemId = table.Column<int>(type: "int", nullable: false),
                    QuantityReturned = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HandledBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicineReturns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicineReturns_PrescriptionItems_PrescriptionItemId",
                        column: x => x.PrescriptionItemId,
                        principalTable: "PrescriptionItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OperatingTheaters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperatingTheaters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PregnancyRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    LMP = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EDD = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gravidity = table.Column<int>(type: "int", nullable: false),
                    Parity = table.Column<int>(type: "int", nullable: false),
                    BloodGroup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RiskFactors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttendingDoctorId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PregnancyRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PregnancyRecords_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RadiologyTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnglishTemplate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArabicTemplate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RadiologyTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BloodDonations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BloodDonorId = table.Column<int>(type: "int", nullable: false),
                    DonationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VolumeMl = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ComponentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BagNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TemperatureAtCollection = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CollectedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BloodStockId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodDonations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BloodDonations_BloodDonors_BloodDonorId",
                        column: x => x.BloodDonorId,
                        principalTable: "BloodDonors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BloodDonations_BloodStocks_BloodStockId",
                        column: x => x.BloodStockId,
                        principalTable: "BloodStocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "InsuranceClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaimNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    InvoiceId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    InsuranceProviderId = table.Column<int>(type: "int", nullable: false),
                    ClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubmissionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StatusDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AuthCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsuranceClaims_InsuranceProviders_InsuranceProviderId",
                        column: x => x.InsuranceProviderId,
                        principalTable: "InsuranceProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InsuranceClaims_Invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InsuranceClaims_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InsurancePlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InsuranceProviderId = table.Column<int>(type: "int", nullable: false),
                    PlanName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CoveragePercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CoPayAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Exclusions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequiresPreAuth = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsurancePlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsurancePlans_InsuranceProviders_InsuranceProviderId",
                        column: x => x.InsuranceProviderId,
                        principalTable: "InsuranceProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScheduledSurgeries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    LeadSurgeonId = table.Column<int>(type: "int", nullable: false),
                    AnesthetistId = table.Column<int>(type: "int", nullable: true),
                    OperatingTheaterId = table.Column<int>(type: "int", nullable: false),
                    BedAdmissionId = table.Column<int>(type: "int", nullable: true),
                    ProcedureName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduledStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduledEndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PreOpDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostOpDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InvoiceId = table.Column<int>(type: "int", nullable: true),
                    TotalCost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduledSurgeries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_BedAdmissions_BedAdmissionId",
                        column: x => x.BedAdmissionId,
                        principalTable: "BedAdmissions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_Doctors_AnesthetistId",
                        column: x => x.AnesthetistId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_Doctors_LeadSurgeonId",
                        column: x => x.LeadSurgeonId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_Invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoices",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_OperatingTheaters_OperatingTheaterId",
                        column: x => x.OperatingTheaterId,
                        principalTable: "OperatingTheaters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PregnancyRecordId = table.Column<int>(type: "int", nullable: false),
                    DeliveryDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModeOfDelivery = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Complications = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttendingDoctor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Midwife = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlacentaWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeliveryRecords_PregnancyRecords_PregnancyRecordId",
                        column: x => x.PregnancyRecordId,
                        principalTable: "PregnancyRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurgeryChecklist",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduledSurgeryId = table.Column<int>(type: "int", nullable: false),
                    Stage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientIdentityConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    SiteMarked = table.Column<bool>(type: "bit", nullable: false),
                    ConsentChecked = table.Column<bool>(type: "bit", nullable: false),
                    AnesthesiaSafetyCheckDone = table.Column<bool>(type: "bit", nullable: false),
                    PulseOximeterOn = table.Column<bool>(type: "bit", nullable: false),
                    AllergyChecked = table.Column<bool>(type: "bit", nullable: false),
                    AirwayRiskAssessed = table.Column<bool>(type: "bit", nullable: false),
                    TeamMembersIntroduced = table.Column<bool>(type: "bit", nullable: false),
                    AnticipatedBloodLossChecked = table.Column<bool>(type: "bit", nullable: false),
                    AntibioticProphylaxisGiven = table.Column<bool>(type: "bit", nullable: false),
                    InstrumentCountConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    SpecimenLabeled = table.Column<bool>(type: "bit", nullable: false),
                    EquipmentIssuesAddressed = table.Column<bool>(type: "bit", nullable: false),
                    CompletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryChecklist", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurgeryChecklist_ScheduledSurgeries_ScheduledSurgeryId",
                        column: x => x.ScheduledSurgeryId,
                        principalTable: "ScheduledSurgeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurgeryResources",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduledSurgeryId = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BatchNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsumedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryResources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurgeryResources_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurgeryResources_ScheduledSurgeries_ScheduledSurgeryId",
                        column: x => x.ScheduledSurgeryId,
                        principalTable: "ScheduledSurgeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NeonatalRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeliveryRecordId = table.Column<int>(type: "int", nullable: false),
                    BabyPatientId = table.Column<int>(type: "int", nullable: false),
                    BirthWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HeadCircumference = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Apgar1Min = table.Column<int>(type: "int", nullable: false),
                    Apgar5Min = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HealthStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IncubatorId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NeonatalRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NeonatalRecords_DeliveryRecords_DeliveryRecordId",
                        column: x => x.DeliveryRecordId,
                        principalTable: "DeliveryRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NeonatalRecords_Patients_BabyPatientId",
                        column: x => x.BabyPatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RadiologyResults_RadiologyTemplateId",
                table: "RadiologyResults",
                column: "RadiologyTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_RadiologyRequests_EmergencyAdmissionId",
                table: "RadiologyRequests",
                column: "EmergencyAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_BedAdmissionId",
                table: "Prescriptions",
                column: "BedAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_EmergencyAdmissionId",
                table: "Prescriptions",
                column: "EmergencyAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientVitals_BedAdmissionId",
                table: "PatientVitals",
                column: "BedAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientVitals_EmergencyAdmissionId",
                table: "PatientVitals",
                column: "EmergencyAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_InsurancePlanId",
                table: "Patients",
                column: "InsurancePlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_InsuranceProviderId",
                table: "Patients",
                column: "InsuranceProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_LabRequests_EmergencyAdmissionId",
                table: "LabRequests",
                column: "EmergencyAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicalEncounters_BedAdmissionId",
                table: "ClinicalEncounters",
                column: "BedAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicalEncounters_EmergencyAdmissionId",
                table: "ClinicalEncounters",
                column: "EmergencyAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecords_EmployeeId",
                table: "AttendanceRecords",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodDonations_BloodDonorId",
                table: "BloodDonations",
                column: "BloodDonorId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodDonations_BloodStockId",
                table: "BloodDonations",
                column: "BloodStockId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodRequests_PatientId",
                table: "BloodRequests",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodStocks_ReservedForPatientId",
                table: "BloodStocks",
                column: "ReservedForPatientId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryRecords_PregnancyRecordId",
                table: "DeliveryRecords",
                column: "PregnancyRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyAdmissions_AssignedDoctorId",
                table: "EmergencyAdmissions",
                column: "AssignedDoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyAdmissions_PatientId",
                table: "EmergencyAdmissions",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_InpatientNursingAssessments_BedAdmissionId",
                table: "InpatientNursingAssessments",
                column: "BedAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceClaims_ClaimNumber",
                table: "InsuranceClaims",
                column: "ClaimNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceClaims_InsuranceProviderId",
                table: "InsuranceClaims",
                column: "InsuranceProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceClaims_InvoiceId",
                table: "InsuranceClaims",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceClaims_PatientId",
                table: "InsuranceClaims",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePlans_InsuranceProviderId",
                table: "InsurancePlans",
                column: "InsuranceProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_LabTestReferenceRanges_LabTestId",
                table: "LabTestReferenceRanges",
                column: "LabTestId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceTickets_AssetId",
                table: "MaintenanceTickets",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationAdministrations_BedAdmissionId",
                table: "MedicationAdministrations",
                column: "BedAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationAdministrations_PrescriptionItemId",
                table: "MedicationAdministrations",
                column: "PrescriptionItemId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineInteractions_ItemAId",
                table: "MedicineInteractions",
                column: "ItemAId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineInteractions_ItemBId",
                table: "MedicineInteractions",
                column: "ItemBId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineReturns_PrescriptionItemId",
                table: "MedicineReturns",
                column: "PrescriptionItemId");

            migrationBuilder.CreateIndex(
                name: "IX_NeonatalRecords_BabyPatientId",
                table: "NeonatalRecords",
                column: "BabyPatientId");

            migrationBuilder.CreateIndex(
                name: "IX_NeonatalRecords_DeliveryRecordId",
                table: "NeonatalRecords",
                column: "DeliveryRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_PregnancyRecords_PatientId",
                table: "PregnancyRecords",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledSurgeries_AnesthetistId",
                table: "ScheduledSurgeries",
                column: "AnesthetistId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledSurgeries_BedAdmissionId",
                table: "ScheduledSurgeries",
                column: "BedAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledSurgeries_InvoiceId",
                table: "ScheduledSurgeries",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledSurgeries_LeadSurgeonId",
                table: "ScheduledSurgeries",
                column: "LeadSurgeonId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledSurgeries_OperatingTheaterId",
                table: "ScheduledSurgeries",
                column: "OperatingTheaterId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledSurgeries_PatientId",
                table: "ScheduledSurgeries",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryChecklist_ScheduledSurgeryId",
                table: "SurgeryChecklist",
                column: "ScheduledSurgeryId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryResources_ItemId",
                table: "SurgeryResources",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryResources_ScheduledSurgeryId",
                table: "SurgeryResources",
                column: "ScheduledSurgeryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClinicalEncounters_BedAdmissions_BedAdmissionId",
                table: "ClinicalEncounters",
                column: "BedAdmissionId",
                principalTable: "BedAdmissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ClinicalEncounters_EmergencyAdmissions_EmergencyAdmissionId",
                table: "ClinicalEncounters",
                column: "EmergencyAdmissionId",
                principalTable: "EmergencyAdmissions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LabRequests_EmergencyAdmissions_EmergencyAdmissionId",
                table: "LabRequests",
                column: "EmergencyAdmissionId",
                principalTable: "EmergencyAdmissions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_InsurancePlans_InsurancePlanId",
                table: "Patients",
                column: "InsurancePlanId",
                principalTable: "InsurancePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_InsuranceProviders_InsuranceProviderId",
                table: "Patients",
                column: "InsuranceProviderId",
                principalTable: "InsuranceProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientVitals_BedAdmissions_BedAdmissionId",
                table: "PatientVitals",
                column: "BedAdmissionId",
                principalTable: "BedAdmissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientVitals_EmergencyAdmissions_EmergencyAdmissionId",
                table: "PatientVitals",
                column: "EmergencyAdmissionId",
                principalTable: "EmergencyAdmissions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_BedAdmissions_BedAdmissionId",
                table: "Prescriptions",
                column: "BedAdmissionId",
                principalTable: "BedAdmissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_EmergencyAdmissions_EmergencyAdmissionId",
                table: "Prescriptions",
                column: "EmergencyAdmissionId",
                principalTable: "EmergencyAdmissions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RadiologyRequests_EmergencyAdmissions_EmergencyAdmissionId",
                table: "RadiologyRequests",
                column: "EmergencyAdmissionId",
                principalTable: "EmergencyAdmissions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RadiologyResults_RadiologyTemplates_RadiologyTemplateId",
                table: "RadiologyResults",
                column: "RadiologyTemplateId",
                principalTable: "RadiologyTemplates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClinicalEncounters_BedAdmissions_BedAdmissionId",
                table: "ClinicalEncounters");

            migrationBuilder.DropForeignKey(
                name: "FK_ClinicalEncounters_EmergencyAdmissions_EmergencyAdmissionId",
                table: "ClinicalEncounters");

            migrationBuilder.DropForeignKey(
                name: "FK_LabRequests_EmergencyAdmissions_EmergencyAdmissionId",
                table: "LabRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_InsurancePlans_InsurancePlanId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_InsuranceProviders_InsuranceProviderId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientVitals_BedAdmissions_BedAdmissionId",
                table: "PatientVitals");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientVitals_EmergencyAdmissions_EmergencyAdmissionId",
                table: "PatientVitals");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_BedAdmissions_BedAdmissionId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_EmergencyAdmissions_EmergencyAdmissionId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_RadiologyRequests_EmergencyAdmissions_EmergencyAdmissionId",
                table: "RadiologyRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_RadiologyResults_RadiologyTemplates_RadiologyTemplateId",
                table: "RadiologyResults");

            migrationBuilder.DropTable(
                name: "AttendanceRecords");

            migrationBuilder.DropTable(
                name: "BloodDonations");

            migrationBuilder.DropTable(
                name: "BloodRequests");

            migrationBuilder.DropTable(
                name: "EmergencyAdmissions");

            migrationBuilder.DropTable(
                name: "ERTriageVitals");

            migrationBuilder.DropTable(
                name: "InpatientNursingAssessments");

            migrationBuilder.DropTable(
                name: "InsuranceClaims");

            migrationBuilder.DropTable(
                name: "InsurancePlans");

            migrationBuilder.DropTable(
                name: "LabTestReferenceRanges");

            migrationBuilder.DropTable(
                name: "MaintenanceTickets");

            migrationBuilder.DropTable(
                name: "MedicationAdministrations");

            migrationBuilder.DropTable(
                name: "MedicineInteractions");

            migrationBuilder.DropTable(
                name: "MedicineReturns");

            migrationBuilder.DropTable(
                name: "NeonatalRecords");

            migrationBuilder.DropTable(
                name: "RadiologyTemplates");

            migrationBuilder.DropTable(
                name: "SurgeryChecklist");

            migrationBuilder.DropTable(
                name: "SurgeryResources");

            migrationBuilder.DropTable(
                name: "BloodDonors");

            migrationBuilder.DropTable(
                name: "BloodStocks");

            migrationBuilder.DropTable(
                name: "InsuranceProviders");

            migrationBuilder.DropTable(
                name: "DeliveryRecords");

            migrationBuilder.DropTable(
                name: "ScheduledSurgeries");

            migrationBuilder.DropTable(
                name: "PregnancyRecords");

            migrationBuilder.DropTable(
                name: "OperatingTheaters");

            migrationBuilder.DropIndex(
                name: "IX_RadiologyResults_RadiologyTemplateId",
                table: "RadiologyResults");

            migrationBuilder.DropIndex(
                name: "IX_RadiologyRequests_EmergencyAdmissionId",
                table: "RadiologyRequests");

            migrationBuilder.DropIndex(
                name: "IX_Prescriptions_BedAdmissionId",
                table: "Prescriptions");

            migrationBuilder.DropIndex(
                name: "IX_Prescriptions_EmergencyAdmissionId",
                table: "Prescriptions");

            migrationBuilder.DropIndex(
                name: "IX_PatientVitals_BedAdmissionId",
                table: "PatientVitals");

            migrationBuilder.DropIndex(
                name: "IX_PatientVitals_EmergencyAdmissionId",
                table: "PatientVitals");

            migrationBuilder.DropIndex(
                name: "IX_Patients_InsurancePlanId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_InsuranceProviderId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_LabRequests_EmergencyAdmissionId",
                table: "LabRequests");

            migrationBuilder.DropIndex(
                name: "IX_ClinicalEncounters_BedAdmissionId",
                table: "ClinicalEncounters");

            migrationBuilder.DropIndex(
                name: "IX_ClinicalEncounters_EmergencyAdmissionId",
                table: "ClinicalEncounters");

            migrationBuilder.DropColumn(
                name: "RadiologyTemplateId",
                table: "RadiologyResults");

            migrationBuilder.DropColumn(
                name: "EmergencyAdmissionId",
                table: "RadiologyRequests");

            migrationBuilder.DropColumn(
                name: "BedAdmissionId",
                table: "Prescriptions");

            migrationBuilder.DropColumn(
                name: "EmergencyAdmissionId",
                table: "Prescriptions");

            migrationBuilder.DropColumn(
                name: "BedAdmissionId",
                table: "PatientVitals");

            migrationBuilder.DropColumn(
                name: "EmergencyAdmissionId",
                table: "PatientVitals");

            migrationBuilder.DropColumn(
                name: "InsurancePlanId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "InsuranceProviderId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "IsCritical",
                table: "LabResults");

            migrationBuilder.DropColumn(
                name: "ResultFlag",
                table: "LabResults");

            migrationBuilder.DropColumn(
                name: "CollectedBy",
                table: "LabRequests");

            migrationBuilder.DropColumn(
                name: "CollectionDate",
                table: "LabRequests");

            migrationBuilder.DropColumn(
                name: "EmergencyAdmissionId",
                table: "LabRequests");

            migrationBuilder.DropColumn(
                name: "ReceivedAtLabDate",
                table: "LabRequests");

            migrationBuilder.DropColumn(
                name: "DosageForm",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "GenericName",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IsNarcotic",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "RequiresRefrigeration",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Strength",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "InsuranceShare",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PatientShare",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "BedAdmissionId",
                table: "ClinicalEncounters");

            migrationBuilder.DropColumn(
                name: "EmergencyAdmissionId",
                table: "ClinicalEncounters");

            migrationBuilder.DropColumn(
                name: "EmergencyAdmissionId",
                table: "BedAdmissions");

            migrationBuilder.DropColumn(
                name: "IsBioMedical",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "LastMaintenanceDate",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "MaintenanceIntervalDays",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Manufacturer",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "ModelNumber",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "NextMaintenanceDate",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "SerialNumber",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "WarrantyExpiryDate",
                table: "Assets");

            migrationBuilder.RenameColumn(
                name: "InsuranceProviderNameManual",
                table: "Patients",
                newName: "InsuranceProvider");

            migrationBuilder.RenameColumn(
                name: "InsuranceCoverageType",
                table: "Patients",
                newName: "InsuranceCoverage");
        }
    }
}
