using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEmergencyEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmergencyTriages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    triageLevel = table.Column<string>(type: "nvarchar(max)", nullable: false), // Immediate, Urgent, Delayed, Minimal
                    ChiefComplaint = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VitalSigns = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BloodPressure = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    HeartRate = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    Temperature = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SpO2 = table.Column<int>(type: "int", nullable: true),
                    GlasgowComaScale = table.Column<int>(type: "int", nullable: true),
                    AssignedDoctorId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Waiting, In-Progress, Treated, Discharged, Admitted
                    TriagedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RoomNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmergencyTriages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmergencyTriages_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EmergencyTriages_Doctors_AssignedDoctorId",
                        column: x => x.AssignedDoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyTriages_PatientId",
                table: "EmergencyTriages",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyTriages_TriageLevel",
                table: "EmergencyTriages",
                column: "triageLevel");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyTriages_Status",
                table: "EmergencyTriages",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmergencyTriages");
        }
    }
}