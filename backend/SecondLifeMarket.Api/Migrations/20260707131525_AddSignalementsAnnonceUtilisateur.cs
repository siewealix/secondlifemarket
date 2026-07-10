using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecondLifeMarket.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSignalementsAnnonceUtilisateur : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SignalementAnnonce",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Motif = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateSignalement = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    StatutSignalement = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateTraitement = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DecisionAdmin = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SignaleurId = table.Column<int>(type: "int", nullable: false),
                    AnnonceId = table.Column<int>(type: "int", nullable: false),
                    AdministrateurId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignalementAnnonce", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SignalementAnnonce_Annonces_AnnonceId",
                        column: x => x.AnnonceId,
                        principalTable: "Annonces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SignalementAnnonce_Utilisateurs_AdministrateurId",
                        column: x => x.AdministrateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SignalementAnnonce_Utilisateurs_SignaleurId",
                        column: x => x.SignaleurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SignalementUtilisateur",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Motif = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateSignalement = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    StatutSignalement = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateTraitement = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DecisionAdmin = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SignaleurId = table.Column<int>(type: "int", nullable: false),
                    UtilisateurSignaleId = table.Column<int>(type: "int", nullable: false),
                    AdministrateurId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignalementUtilisateur", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SignalementUtilisateur_Utilisateurs_AdministrateurId",
                        column: x => x.AdministrateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SignalementUtilisateur_Utilisateurs_SignaleurId",
                        column: x => x.SignaleurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SignalementUtilisateur_Utilisateurs_UtilisateurSignaleId",
                        column: x => x.UtilisateurSignaleId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SignalementAnnonce_AdministrateurId",
                table: "SignalementAnnonce",
                column: "AdministrateurId");

            migrationBuilder.CreateIndex(
                name: "IX_SignalementAnnonce_AnnonceId",
                table: "SignalementAnnonce",
                column: "AnnonceId");

            migrationBuilder.CreateIndex(
                name: "IX_SignalementAnnonce_SignaleurId",
                table: "SignalementAnnonce",
                column: "SignaleurId");

            migrationBuilder.CreateIndex(
                name: "IX_SignalementUtilisateur_AdministrateurId",
                table: "SignalementUtilisateur",
                column: "AdministrateurId");

            migrationBuilder.CreateIndex(
                name: "IX_SignalementUtilisateur_SignaleurId",
                table: "SignalementUtilisateur",
                column: "SignaleurId");

            migrationBuilder.CreateIndex(
                name: "IX_SignalementUtilisateur_UtilisateurSignaleId",
                table: "SignalementUtilisateur",
                column: "UtilisateurSignaleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SignalementAnnonce");

            migrationBuilder.DropTable(
                name: "SignalementUtilisateur");
        }
    }
}
