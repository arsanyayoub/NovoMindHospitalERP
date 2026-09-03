using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHousekeepingEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HousekeepingTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Frequency = table.Column<string>(type: "nvarchar(max)", nullable: false), // Daily, Weekly, Monthly
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false), // Low, Medium, High, Critical
                    AssignedToId = table.Column<int>(type: "int", nullable: true),
                    AssignedToUser = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(200)", nullable: true), // Ward, Room, Area
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false), // Pending, In-Progress, Completed
                    ScheduledDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HousekeepingTasks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HousekeepingTasks_AssignedToId",
                table: "HousekeepingTasks",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_HousekeepingTasks_Frequency",
                table: "HousekeepingTasks",
                column: "Frequency");

            migrationBuilder.CreateIndex(
                name: "IX_HousekeepingTasks_Status",
                table: "HousekeepingTasks",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HousekeepingTasks");
        }
    }
}