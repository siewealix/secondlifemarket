using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecondLifeMarket.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTypeAbonnementRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Montant",
                table: "Abonnements");

            migrationBuilder.AddColumn<int>(
                name: "TypeAbonnementId",
                table: "Abonnements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TypeAbonnement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nom = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Prix = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DureeJours = table.Column<int>(type: "int", nullable: false),
                    LimitePublication = table.Column<int>(type: "int", nullable: false),
                    EstActif = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DateModification = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeAbonnement", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Abonnements_TypeAbonnementId",
                table: "Abonnements",
                column: "TypeAbonnementId");

            migrationBuilder.CreateIndex(
                name: "IX_TypeAbonnement_Nom",
                table: "TypeAbonnement",
                column: "Nom",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Abonnements_TypeAbonnement_TypeAbonnementId",
                table: "Abonnements",
                column: "TypeAbonnementId",
                principalTable: "TypeAbonnement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Abonnements_TypeAbonnement_TypeAbonnementId",
                table: "Abonnements");

            migrationBuilder.DropTable(
                name: "TypeAbonnement");

            migrationBuilder.DropIndex(
                name: "IX_Abonnements_TypeAbonnementId",
                table: "Abonnements");

            migrationBuilder.DropColumn(
                name: "TypeAbonnementId",
                table: "Abonnements");

            migrationBuilder.AddColumn<decimal>(
                name: "Montant",
                table: "Abonnements",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
