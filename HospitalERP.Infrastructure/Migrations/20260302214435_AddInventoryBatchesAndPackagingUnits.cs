using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryBatchesAndPackagingUnits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItemBatchId",
                table: "StockTransactions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TrackBatches",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ItemBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    SupplierId = table.Column<int>(type: "int", nullable: true),
                    WarehouseId = table.Column<int>(type: "int", nullable: true),
                    BatchNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Barcode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ManufactureDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuantityReceived = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QuantityRemaining = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UnitCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LotNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceivedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemBatches_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemBatches_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ItemBatches_Warehouses_WarehouseId",
                        column: x => x.WarehouseId,
                        principalTable: "Warehouses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemPackagingUnits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    UnitName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitNameAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barcode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UnitsPerPackage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BaseUnitQty = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsBaseUnit = table.Column<bool>(type: "bit", nullable: false),
                    SalePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PurchasePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemPackagingUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemPackagingUnits_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_ItemBatchId",
                table: "StockTransactions",
                column: "ItemBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemBatches_Barcode",
                table: "ItemBatches",
                column: "Barcode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemBatches_BatchNumber",
                table: "ItemBatches",
                column: "BatchNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemBatches_ItemId",
                table: "ItemBatches",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemBatches_SupplierId",
                table: "ItemBatches",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemBatches_WarehouseId",
                table: "ItemBatches",
                column: "WarehouseId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemPackagingUnits_Barcode",
                table: "ItemPackagingUnits",
                column: "Barcode");

            migrationBuilder.CreateIndex(
                name: "IX_ItemPackagingUnits_ItemId",
                table: "ItemPackagingUnits",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockTransactions_ItemBatches_ItemBatchId",
                table: "StockTransactions",
                column: "ItemBatchId",
                principalTable: "ItemBatches",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockTransactions_ItemBatches_ItemBatchId",
                table: "StockTransactions");

            migrationBuilder.DropTable(
                name: "ItemBatches");

            migrationBuilder.DropTable(
                name: "ItemPackagingUnits");

            migrationBuilder.DropIndex(
                name: "IX_StockTransactions_ItemBatchId",
                table: "StockTransactions");

            migrationBuilder.DropColumn(
                name: "ItemBatchId",
                table: "StockTransactions");

            migrationBuilder.DropColumn(
                name: "TrackBatches",
                table: "Items");
        }
    }
}
