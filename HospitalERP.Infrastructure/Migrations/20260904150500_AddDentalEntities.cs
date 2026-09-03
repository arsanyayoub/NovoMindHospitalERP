using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDentalEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DentalCharts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    TeethStatusJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OverallNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DentalCharts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DentalCharts_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DentalProcedures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DentalChartId = table.Column<int>(type: "int", nullable: false),
                    ToothNumber = table.Column<int>(type: "int", nullable: false),
                    ProcedureType = table.Column<string>(type: "nvarchar(max)", nullable: false), // Filling, Root Canal, Extraction, Bridge, Crown
                    Surfaces = table.Column<string>(type: "nvarchar(max)", nullable: false), // MO, DO, MOD, etc.
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProcedureDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DentistId = table.Column<int>(type: "int", nullable: false),
                    ClinicNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DentalProcedures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DentalProcedures_DentalCharts_DentalChartId",
                        column: x => x.DentalChartId,
                        principalTable: "DentalCharts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DentalProcedures_Doctors_DentistId",
                        column: x => x.DentistId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrthodonticCases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    CaseType = table.Column<string>(type: "nvarchar(max)", nullable: false), // Braces, Invisalign, Retainer
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpectedCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalAgreedCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Active, OnHold, Completed
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrthodonticCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrthodonticCases_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DentalCharts_PatientId",
                table: "DentalCharts",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_DentalProcedures_DentalChartId",
                table: "DentalProcedures",
                column: "DentalChartId");

            migrationBuilder.CreateIndex(
                name: "IX_DentalProcedures_DentistId",
                table: "DentalProcedures",
                column: "DentistId");

            migrationBuilder.CreateIndex(
                name: "IX_OrthodonticCases_PatientId",
                table: "OrthodonticCases",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrthodonticCases");

            migrationBuilder.DropTable(
                name: "DentalProcedures");

            migrationBuilder.DropTable(
                name: "DentalCharts");
        }
    }
}