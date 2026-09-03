using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReferralsEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReferralFacilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true), // Hospital, Clinic, Diagnostic Center
                    ContactPerson = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    HieEndpoint = table.Column<string>(type: "nvarchar(500)", nullable: true), // URL for FHIR/HL7 exchange
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReferralFacilities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExternalReferrals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    FacilityId = table.Column<int>(type: "int", nullable: false),
                    ReferralType = table.Column<string>(type: "nvarchar(max)", nullable: false), // Inbound, Outbound
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Pending, Completed, Cancelled
                    ReferralDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClinicalSummary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExternalDoctorName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalReferrals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExternalReferrals_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExternalReferrals_ReferralFacilities_FacilityId",
                        column: x => x.FacilityId,
                        principalTable: "ReferralFacilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HieTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExternalReferralId = table.Column<int>(type: "int", nullable: true),
                    TransactionType = table.Column<string>(type: "nvarchar(max)", nullable: false), // Export, Import
                    DataStandard = table.Column<string>(type: "nvarchar(max)", nullable: false), // FHIR, HL7_v2, CDA
                    Payload = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Success, Failed
                    ErrorMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HieTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HieTransactions_ExternalReferrals_ExternalReferralId",
                        column: x => x.ExternalReferralId,
                        principalTable: "ExternalReferrals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExternalReferrals_FacilityId",
                table: "ExternalReferrals",
                column: "FacilityId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalReferrals_PatientId",
                table: "ExternalReferrals",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalReferrals_ReferralType",
                table: "ExternalReferrals",
                column: "ReferralType");

            migrationBuilder.CreateIndex(
                name: "IX_HieTransactions_ExternalReferralId",
                table: "HieTransactions",
                column: "ExternalReferralId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HieTransactions");

            migrationBuilder.DropTable(
                name: "ExternalReferrals");

            migrationBuilder.DropTable(
                name: "ReferralFacilities");
        }
    }
}