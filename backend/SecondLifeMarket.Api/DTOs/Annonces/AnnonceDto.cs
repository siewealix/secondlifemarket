// On place ce fichier dans le namespace DTOs Annonces.
namespace SecondLifeMarket.Api.DTOs.Annonces;

// On crée le DTO envoyé au frontend.
public class AnnonceDto
{
    // On renvoie l'identifiant.
    public int Id { get; set; }

    // On renvoie le titre.
    public string Titre { get; set; } = string.Empty;

    // On renvoie la description.
    public string Description { get; set; } = string.Empty;

    // On renvoie le prix.
    public decimal Prix { get; set; }

    // On renvoie la ville.
    public string Ville { get; set; } = string.Empty;

    // On renvoie l'état de l'objet.
    public string EtatObjet { get; set; } = string.Empty;

    // On renvoie le statut.
    public string Statut { get; set; } = string.Empty;

    // On renvoie l'état actif.
    public bool EstActive { get; set; }

    // On renvoie la date de publication.
    public DateTime DatePublication { get; set; }

    // On renvoie l'identifiant du vendeur.
    public int UtilisateurId { get; set; }

    // On renvoie le nom du vendeur.
    public string NomVendeur { get; set; } = string.Empty;

    // On renvoie l'identifiant de la catégorie.
    public int CategorieId { get; set; }

    // On renvoie le nom de la catégorie.
    public string NomCategorie { get; set; } = string.Empty;

    // On renvoie l'adresse de la photo principale.
    public string PhotoPrincipaleUrl { get; set; } = string.Empty;

    // On renvoie toutes les photos de l'annonce.
    public List<PhotoDto> Photos { get; set; } = new();

    // On renvoie la dernière décision IA.
    public string DerniereDecisionIa { get; set; } = string.Empty;

    // On renvoie le dernier score IA.
    public int? DernierScoreConfianceIa { get; set; }

    // On renvoie le dernier motif IA.
    public string DernierMotifIa { get; set; } = string.Empty;

    // On renvoie la version du modèle IA.
    public string DerniereVersionModeleIa { get; set; } = string.Empty;

}