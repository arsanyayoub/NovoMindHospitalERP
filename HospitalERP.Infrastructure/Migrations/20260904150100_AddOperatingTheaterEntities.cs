using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOperatingTheaterEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OperatingTheaters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Available, Under Maintenance, Busy
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
                name: "ScheduledSurgeries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    LeadSurgeonId = table.Column<int>(type: "int", nullable: false),
                    OperatingTheaterId = table.Column<int>(type: "int", nullable: false),
                    AnesthetistId = table.Column<int>(type: "int", nullable: true),
                    BedAdmissionId = table.Column<int>(type: "int", nullable: true),
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false), // Routine, Emergency, Urgent
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Scheduled, Pre-Op, Intra-Op, Post-Op, Completed, Cancelled
                    ScheduledStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduledEndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PreOpDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostOpDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                        name: "FK_ScheduledSurgery_Doctors_LeadSurgeonId",
                        column: x => x.LeadSurgeonId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_OperatingTheaters_OperatingTheaterId",
                        column: x => x.OperatingTheaterId,
                        principalTable: "OperatingTheaters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScheduledSurgeries_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SurgeryChecklists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduledSurgeryId = table.Column<int>(type: "int", nullable: false),
                    Stage = table.Column<string>(type: "nvarchar(max)", nullable: false), // Sign-In, Time-Out, Sign-Out
                    PatientIdentityConfirmed = table.Column<bool>(type: "bit"), // true/false
                    SiteMarked = table.Column<bool>(type: "bit"), // true/false
                    ConsentChecked = table.Column<bool>(type: "bit"), // true/false
                    AnesthesiaSafetyCheckDone = table.Column<bool>(type: "bit"), // true/false
                    PulseOximeterOn = table.Column<bool>(type: "bit"), // true/false
                    AllergyChecked = table.Column<bool>(type: "bit"), // true/false
                    AirwayRiskAssessed = table.Column<bool>(type: "bit"), // true/false
                    TeamMembersIntroduced = table.Column<bool>(type: "bit"), // true/false
                    AnticipatedBloodLossChecked = table.Column<bool>(type: "bit"), // true/false
                    AntibioticProphylaxisGiven = table.Column<bool>(type: "bit"), // true/false
                    InstrumentCountConfirmed = table.Column<bool>(type: "bit"), // true/false
                    SpecimenLabeled = table.Column<bool>(type: "bit"), // true/false
                    EquipmentIssuesAddressed = table.Column<bool>(type: "bit"), // true/false
                    CompletedBy = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryChecklists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurgeryChecklists_ScheduledSurgeries_ScheduledSurgeryId",
                        column: x => x.ScheduledSurgeryId,
                        principalTable: "ScheduledSurgeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "IX_SurgeryChecklists_ScheduledSurgeryId",
                table: "SurgeryChecklists",
                column: "ScheduledSurgeryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SurgeryChecklists");

            migrationBuilder.DropTable(
                name: "ScheduledSurgeries");

            migrationBuilder.DropTable(
                name: "OperatingTheaters");
        }
    }
}