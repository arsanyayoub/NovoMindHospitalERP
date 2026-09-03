using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddClinicalEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PatientVitals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    AppointmentId = table.Column<int>(type: "int", nullable: true),
                    BedAdmissionId = table.Column<int>(type: "int", nullable: true),
                    EmergencyAdmissionId = table.Column<int>(type: "int", nullable: true),
                    RecordedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecordedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),

                    Temperature = table.Column<decimal>(type: "decimal(18,2)", nullable: true), // Celsius
                    BloodPressureSystolic = table.Column<int>(type: "int", nullable: true), // mmHg
                    BloodPressureDiastolic = table.Column<int>(type: "int", nullable: true), // mmHg
                    HeartRate = table.Column<int>(type: "int", nullable: true), // bpm
                    RespiratoryRate = table.Column<int>(type: "int", nullable: true), // breaths/min
                    SpO2 = table.Column<int>(type: "int", nullable: true), // Oxygen Saturation %
                    WeightKg = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HeightCm = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    BMI = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PainScale = table.Column<string>(type: "nvarchar(max)", nullable: true), // 1-10
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),

                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientVitals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientVitals_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientVitals_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PatientVitals_BedAdmissions_BedAdmissionId",
                        column: x => x.BedAdmissionId,
                        principalTable: "BedAdmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PatientVitals_EmergencyAdmissions_EmergencyAdmissionId",
                        column: x => x.EmergencyAdmissionId,
                        principalTable: "EmergencyAdmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrescriptionNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: true),
                    AppointmentId = table.Column<int>(type: "int", nullable: true),
                    PrescriptionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Pending, Dispensed, Cancelled
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),

                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: false),

                    Dosage = table.Column<string>(type: "nvarchar(max)", nullable: false), // e.g. 500mg
                    Frequency = table.Column<string>(type: "nvarchar(max)", nullable: false), // e.g. TID, Once daily
                    Duration = table.Column<string>(type: "nvarchar(max)", nullable: false), // e.g. 5 days
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false), // Total quantity to dispense
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: true), // e.g. After food

                    IsDispensed = table.Column<bool>(type: "bit", nullable: false),
                    DispensedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DispensedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),

                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClinicalEncounters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: true),
                    AppointmentId = table.Column<int>(type: "int", nullable: true),
                    BedAdmissionId = table.Column<int>(type: "int", nullable: true),

                    EncounterDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ChiefComplaint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subjective = table.Column<string>(type: "nvarchar(max)", nullable: true), // Symptoms, history
                    Objective = table.Column<string>(type: "nvarchar(max)", nullable: true), // Findings from exam
                    Assessment = table.Column<string>(type: "nvarchar(max)", nullable: true), // Diagnosis
                    Plan = table.Column<string>(type: "nvarchar(max)", nullable: true), // Treatment, follow-up
                    InternalNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsFinalized = table.Column<bool>(type: "bit", nullable: false),

                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicalEncounters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClinicalEncounters_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClinicalEncounters_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ClinicalEncounters_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id");
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
                    Shift = table.Column<string>(type: "nvarchar(max)", nullable: false), // Day, Evening, Night

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
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Given, Refused, Held
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
                        name: "FK_MedicationAdministrations_PrescriptionItems_PrescriptionItemId",
                        column: x => x.PrescriptionItemId,
                        principalTable: "PrescriptionItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_BedAdmissions_BedAdmissionId",
                        column: x => x.BedAdmissionId,
                        principalTable: "BedAdmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Accepted | Rejected | Quarantined
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
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientVitals_PatientId",
                table: "PatientVitals",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientVitals_EmergencyAdmissionId",
                table: "PatientVitals",
                column: "EmergencyAdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_PatientId",
                table: "Prescriptions",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_PrescriptionNumber",
                table: "Prescriptions",
                column: "PrescriptionNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_PrescriptionId",
                table: "PrescriptionItems",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_ItemId",
                table: "PrescriptionItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicalEncounters_PatientId",
                table: "ClinicalEncounters",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClinicalEncounters_DoctorId",
                table: "ClinicalEncounters",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_InpatientNursingAssessments_BedAdmissionId",
                table: "InpatientNursingAssessments",
                column: "BedAdmissionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicineReturns");

            migrationBuilder.DropTable(
                name: "MedicationAdministrations");

            migrationBuilder.DropTable(
                name: "InpatientNursingAssessments");

            migrationBuilder.DropTable(
                name: "ClinicalEncounters");

            migrationBuilder.DropTable(
                name: "PrescriptionItems");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "PatientVitals");
        }
    }
}