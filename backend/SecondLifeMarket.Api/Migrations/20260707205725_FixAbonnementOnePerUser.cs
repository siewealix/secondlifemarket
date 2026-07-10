using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecondLifeMarket.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixAbonnementOnePerUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Abonnements_UtilisateurId",
                table: "Abonnements");

            migrationBuilder.CreateIndex(
                name: "IX_Abonnements_UtilisateurId",
                table: "Abonnements",
                column: "UtilisateurId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Abonnements_UtilisateurId",
                table: "Abonnements");

            migrationBuilder.CreateIndex(
                name: "IX_Abonnements_UtilisateurId",
                table: "Abonnements",
                column: "UtilisateurId");
        }
    }
}
