using System.ComponentModel.DataAnnotations;

namespace SecondLifeMarket.Api.Models;

public class Abonnement
{
    // Identifiant unique de l'abonnement.
    public int Id { get; set; }

    // Type d'abonnement choisi.
    [MaxLength(50)]
    public string TypeAbonnement { get; set; } = string.Empty;

    // Date de début de l'abonnement.
    public DateTime DateDebut { get; set; } = DateTime.UtcNow;

    // Date de fin de l'abonnement.
    public DateTime DateFin { get; set; }

    // Statut de l'abonnement.
    [MaxLength(30)]
    public string StatutAbonnement { get; set; } = "Actif";

    // Limite de publication autorisée.
    public int LimitePublication { get; set; }

    // Montant de l'abonnement.
    public decimal Montant { get; set; }

    // Identifiant du membre qui a souscrit.
    public int UtilisateurId { get; set; }

    // Membre qui a souscrit à l'abonnement.
    public Utilisateur? Utilisateur { get; set; }
}