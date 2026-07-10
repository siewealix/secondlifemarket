using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecondLifeMarket.Api.Models;

[Table("TypeAbonnement")]
public class TypeAbonnement
{
    // Identifiant du type d'abonnement.
    public int Id { get; set; }

    // Nom de l'offre, par exemple Basic, Standard ou Premium.
    [MaxLength(50)]
    public string Nom { get; set; } = string.Empty;

    // Description de l'offre.
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    // Prix de l'offre.
    public decimal Prix { get; set; }

    // Durée de l'offre en jours.
    public int DureeJours { get; set; }

    // Limite de publication de cette offre.
    public int LimitePublication { get; set; }

    // Indique si l'offre est disponible.
    public bool EstActif { get; set; } = true;

    // Date de création.
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    // Date de dernière modification.
    public DateTime? DateModification { get; set; }

    // Liste des abonnements liés à ce type.
    public List<Abonnement> Abonnements { get; set; } = new();
}