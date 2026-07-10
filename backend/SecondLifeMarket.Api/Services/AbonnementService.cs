using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Abonnements;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class AbonnementService : IAbonnementService
{
    // Limite gratuite pour un membre sans abonnement.
    private const int LimiteGratuitePublication = 3;

    // Contexte de base de données.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public AbonnementService(ApplicationDbContext context)
    {
        // On garde le contexte dans une variable privée.
        _context = context;
    }

    // Méthode qui retourne les offres d'abonnement disponibles.
    public async Task<List<OffreAbonnementDto>> GetOffresAbonnementAsync()
    {
        // On récupère seulement les types d'abonnement actifs.
        List<TypeAbonnement> types = await _context.TypesAbonnement
            .Where(type => type.EstActif)
            .OrderBy(type => type.Prix)
            .ToListAsync();

        // On transforme les types d'abonnement en DTO.
        return types.Select(type => new OffreAbonnementDto
        {
            // Nom de l'offre.
            TypeAbonnement = type.Nom,

            // Description de l'offre.
            Description = type.Description,

            // Prix de l'offre.
            Prix = type.Prix,

            // Durée en jours.
            DureeJours = type.DureeJours,

            // Limite de publication.
            LimitePublication = type.LimitePublication
        }).ToList();
    }

    // Méthode qui permet à un membre de souscrire ou de changer d'abonnement.
    public async Task<AbonnementDto> SouscrireAbonnementAsync(SouscrireAbonnementDto dto, int utilisateurId)
    {
        // On vérifie si les données envoyées sont absentes.
        if (dto == null)
        {
            // On bloque si aucune donnée n'est envoyée.
            throw new InvalidOperationException("Les informations de l'abonnement sont obligatoires.");
        }

        // On nettoie le type d'abonnement reçu.
        string typeAbonnement = dto.TypeAbonnement?.Trim() ?? string.Empty;

        // On vérifie si le type est vide.
        if (string.IsNullOrWhiteSpace(typeAbonnement))
        {
            // On bloque si aucun type n'est envoyé.
            throw new InvalidOperationException("Le type d'abonnement est obligatoire.");
        }

        // On cherche l'utilisateur connecté.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On vérifie si le compte est actif.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est suspendu.
            throw new InvalidOperationException("Votre compte est suspendu.");
        }

        // On vérifie si l'utilisateur est bien un membre.
        if (utilisateur.Role != "Membre")
        {
            // On bloque si ce n'est pas un membre.
            throw new InvalidOperationException("Seuls les membres peuvent souscrire à un abonnement.");
        }

        // On cherche le type d'abonnement actif choisi.
        TypeAbonnement? type = await _context.TypesAbonnement
            .FirstOrDefaultAsync(item =>
                item.EstActif &&
                item.Nom.ToLower() == typeAbonnement.ToLower()
            );

        // On vérifie si l'offre existe.
        if (type == null)
        {
            // On bloque si l'offre est inexistante ou désactivée.
            throw new InvalidOperationException("Cette offre d'abonnement n'existe pas ou n'est pas active.");
        }

        // On récupère la date actuelle.
        DateTime now = DateTime.UtcNow;

        // On cherche l'abonnement existant du membre.
        Abonnement? abonnementExistant = await _context.Abonnements
            .Include(item => item.Utilisateur)
            .Include(item => item.TypeAbonnementNavigation)
            .FirstOrDefaultAsync(item => item.UtilisateurId == utilisateurId);

        // Si le membre n'a pas encore d'abonnement, on crée une nouvelle ligne.
        if (abonnementExistant == null)
        {
            // On crée le nouvel abonnement.
            Abonnement nouvelAbonnement = new()
            {
                // On garde une copie du nom de l'offre.
                TypeAbonnement = type.Nom,

                // On enregistre la date de début.
                DateDebut = now,

                // On calcule la date de fin.
                DateFin = now.AddDays(type.DureeJours),

                // On met le statut actif.
                StatutAbonnement = "Actif",

                // On garde une copie de la limite de publication.
                LimitePublication = type.LimitePublication,

                // On relie l'abonnement au membre connecté.
                UtilisateurId = utilisateurId,

                // On relie l'abonnement au type d'abonnement.
                TypeAbonnementId = type.Id
            };

            // On ajoute l'abonnement dans le contexte.
            _context.Abonnements.Add(nouvelAbonnement);

            // On sauvegarde dans MySQL.
            await _context.SaveChangesAsync();

            // On recharge l'abonnement avec ses relations.
            Abonnement abonnementCree = await _context.Abonnements
                .Include(item => item.Utilisateur)
                .Include(item => item.TypeAbonnementNavigation)
                .FirstAsync(item => item.Id == nouvelAbonnement.Id);

            // On retourne l'abonnement créé.
            return ToDto(abonnementCree);
        }

        // On vérifie si le membre choisit exactement la même offre encore active.
        if (abonnementExistant.TypeAbonnementId == type.Id &&
            abonnementExistant.StatutAbonnement == "Actif" &&
            abonnementExistant.DateFin >= now)
        {
            // On bloque car il a déjà cette offre active.
            throw new InvalidOperationException("Vous avez déjà cet abonnement actif.");
        }

        // On met à jour l'abonnement existant au lieu de créer une deuxième ligne.
        abonnementExistant.TypeAbonnement = type.Nom;

        // On relie au nouveau type d'abonnement.
        abonnementExistant.TypeAbonnementId = type.Id;

        // On remet la date de début à aujourd'hui.
        abonnementExistant.DateDebut = now;

        // On calcule la nouvelle date de fin.
        abonnementExistant.DateFin = now.AddDays(type.DureeJours);

        // On remet le statut actif.
        abonnementExistant.StatutAbonnement = "Actif";

        // On met à jour la limite de publication.
        abonnementExistant.LimitePublication = type.LimitePublication;

        // On sauvegarde les modifications.
        await _context.SaveChangesAsync();

        // On recharge l'abonnement avec ses relations.
        Abonnement abonnementMisAJour = await _context.Abonnements
            .Include(item => item.Utilisateur)
            .Include(item => item.TypeAbonnementNavigation)
            .FirstAsync(item => item.Id == abonnementExistant.Id);

        // On retourne l'abonnement mis à jour.
        return ToDto(abonnementMisAJour);
    }

    // Méthode qui permet à un membre de résilier son abonnement.
    public async Task<MonAbonnementDto> ResilierAbonnementAsync(int utilisateurId)
    {
        // On cherche l'utilisateur connecté.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On vérifie si le compte est actif.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est suspendu.
            throw new InvalidOperationException("Votre compte est suspendu.");
        }

        // On vérifie si l'utilisateur est bien un membre.
        if (utilisateur.Role != "Membre")
        {
            // On bloque si ce n'est pas un membre.
            throw new InvalidOperationException("Seuls les membres peuvent résilier un abonnement.");
        }

        // On cherche l'abonnement du membre.
        Abonnement? abonnement = await _context.Abonnements
            .FirstOrDefaultAsync(item => item.UtilisateurId == utilisateurId);

        // On vérifie si aucun abonnement n'existe.
        if (abonnement == null)
        {
            // On bloque car il n'y a rien à résilier.
            throw new InvalidOperationException("Vous n'avez aucun abonnement à résilier.");
        }

        // On vérifie si l'abonnement est déjà résilié.
        if (abonnement.StatutAbonnement == "Résilié")
        {
            // On bloque car l'abonnement est déjà résilié.
            throw new InvalidOperationException("Votre abonnement est déjà résilié.");
        }

        // On vérifie si l'abonnement est déjà expiré.
        if (abonnement.StatutAbonnement == "Expiré")
        {
            // On bloque car l'abonnement n'est plus actif.
            throw new InvalidOperationException("Votre abonnement est déjà expiré.");
        }

        // On marque l'abonnement comme résilié.
        abonnement.StatutAbonnement = "Résilié";

        // On met la date de fin à maintenant.
        abonnement.DateFin = DateTime.UtcNow;

        // On sauvegarde dans MySQL.
        await _context.SaveChangesAsync();

        // On retourne la nouvelle situation du membre.
        return await GetMonAbonnementAsync(utilisateurId);
    }

    // Méthode qui retourne l'abonnement actuel du membre.
    public async Task<MonAbonnementDto> GetMonAbonnementAsync(int utilisateurId)
    {
        // On cherche l'utilisateur connecté.
        Utilisateur? utilisateur = await _context.Utilisateurs
            .FirstOrDefaultAsync(item => item.Id == utilisateurId);

        // On vérifie si l'utilisateur existe.
        if (utilisateur == null)
        {
            // On bloque si l'utilisateur est introuvable.
            throw new InvalidOperationException("Utilisateur introuvable.");
        }

        // On vérifie si le compte est actif.
        if (!utilisateur.EstActif)
        {
            // On bloque si le compte est suspendu.
            throw new InvalidOperationException("Votre compte est suspendu.");
        }

        // On compte les publications déjà utilisées par le membre.
        int nombrePublications = await CountPublicationsUtilisateurAsync(utilisateurId);

        // On cherche l'abonnement du membre.
        Abonnement? abonnement = await _context.Abonnements
            .FirstOrDefaultAsync(item => item.UtilisateurId == utilisateurId);

        // On vérifie si le membre n'a aucun abonnement.
        if (abonnement == null)
        {
            // On retourne la situation gratuite.
            return BuildMonAbonnementDto(
                aUnAbonnement: false,
                abonnementActif: false,
                typeAbonnement: "Gratuit",
                dateDebut: null,
                dateFin: null,
                statutAbonnement: "Sans abonnement",
                limitePublication: LimiteGratuitePublication,
                nombrePublications: nombrePublications,
                message: "Vous utilisez l'offre gratuite limitée à 3 publications."
            );
        }

        // On récupère la date actuelle.
        DateTime now = DateTime.UtcNow;

        // On vérifie si l'abonnement est expiré.
        bool abonnementExpire = abonnement.DateFin < now;

        // Si l'abonnement est expiré et encore marqué actif, on corrige son statut.
        if (abonnementExpire && abonnement.StatutAbonnement == "Actif")
        {
            // On marque l'abonnement comme expiré.
            abonnement.StatutAbonnement = "Expiré";

            // On sauvegarde la modification dans la base de données.
            await _context.SaveChangesAsync();
        }

        // On vérifie si l'abonnement n'est pas actif.
        bool abonnementNonActif =
            abonnement.StatutAbonnement != "Actif" ||
            abonnementExpire;

        // Si l'abonnement est résilié, expiré ou non actif, la limite redevient gratuite.
        if (abonnementNonActif)
        {
            // On retourne la situation avec la limite gratuite.
            return BuildMonAbonnementDto(
                aUnAbonnement: true,
                abonnementActif: false,
                typeAbonnement: abonnement.TypeAbonnement,
                dateDebut: abonnement.DateDebut,
                dateFin: abonnement.DateFin,
                statutAbonnement: abonnement.StatutAbonnement,
                limitePublication: LimiteGratuitePublication,
                nombrePublications: nombrePublications,
                message: "Votre abonnement n'est pas actif. Votre limite actuelle est de 3 publications."
            );
        }

        // On retourne la situation avec abonnement actif.
        return BuildMonAbonnementDto(
            aUnAbonnement: true,
            abonnementActif: true,
            typeAbonnement: abonnement.TypeAbonnement,
            dateDebut: abonnement.DateDebut,
            dateFin: abonnement.DateFin,
            statutAbonnement: abonnement.StatutAbonnement,
            limitePublication: abonnement.LimitePublication,
            nombrePublications: nombrePublications,
            message: "Vous avez un abonnement actif."
        );
    }

    // Méthode qui retourne la limite gratuite de publication.
    public int GetLimiteGratuitePublication()
    {
        // On retourne la limite gratuite.
        return LimiteGratuitePublication;
    }

    // Méthode qui compte les publications utilisées par un utilisateur.
    private async Task<int> CountPublicationsUtilisateurAsync(int utilisateurId)
    {
        // On compte les annonces actives qui ont dépassé l'étape de création.
        int count = await _context.Annonces
            .CountAsync(item =>
                item.UtilisateurId == utilisateurId &&
                item.EstActive &&
                item.Statut != "En création"
            );

        // On retourne le nombre trouvé.
        return count;
    }

    // Méthode qui construit le DTO de mon abonnement.
    private static MonAbonnementDto BuildMonAbonnementDto(
        bool aUnAbonnement,
        bool abonnementActif,
        string typeAbonnement,
        DateTime? dateDebut,
        DateTime? dateFin,
        string statutAbonnement,
        int limitePublication,
        int nombrePublications,
        string message
    )
    {
        // On calcule le nombre de publications restantes.
        int nombreRestant = limitePublication - nombrePublications;

        // On évite un nombre négatif.
        if (nombreRestant < 0)
        {
            // On remet à zéro.
            nombreRestant = 0;
        }

        // On retourne les informations de l'abonnement.
        return new MonAbonnementDto
        {
            // On indique si le membre possède une ligne d'abonnement.
            AUnAbonnement = aUnAbonnement,

            // On indique si l'abonnement est actuellement actif.
            AbonnementActif = abonnementActif,

            // On retourne le type d'abonnement.
            TypeAbonnement = typeAbonnement,

            // On retourne la date de début.
            DateDebut = dateDebut,

            // On retourne la date de fin.
            DateFin = dateFin,

            // On retourne le statut.
            StatutAbonnement = statutAbonnement,

            // On retourne la limite actuelle.
            LimitePublication = limitePublication,

            // On retourne le nombre de publications utilisées.
            NombrePublicationsUtilisees = nombrePublications,

            // On retourne le nombre de publications restantes.
            NombrePublicationsRestantes = nombreRestant,

            // On indique si le membre peut encore publier.
            PeutPublier = nombreRestant > 0,

            // On retourne le message.
            Message = message
        };
    }

    // Méthode qui transforme un abonnement en DTO.
    private static AbonnementDto ToDto(Abonnement abonnement)
    {
        // On retourne un objet simple pour le frontend.
        return new AbonnementDto
        {
            // On retourne l'identifiant.
            Id = abonnement.Id,

            // On retourne le type d'abonnement.
            TypeAbonnement = abonnement.TypeAbonnement,

            // On retourne la date de début.
            DateDebut = abonnement.DateDebut,

            // On retourne la date de fin.
            DateFin = abonnement.DateFin,

            // On retourne le statut.
            StatutAbonnement = abonnement.StatutAbonnement,

            // On retourne la limite de publication.
            LimitePublication = abonnement.LimitePublication,

            // On retourne l'identifiant du membre.
            UtilisateurId = abonnement.UtilisateurId,

            // On retourne le nom complet du membre.
            UtilisateurNomComplet = $"{abonnement.Utilisateur?.Prenom} {abonnement.Utilisateur?.Nom}".Trim()
        };
    }
}