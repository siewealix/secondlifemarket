using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;
using SecondLifeMarket.Api.DTOs.Abonnements.Admin;
using SecondLifeMarket.Api.Models;
using SecondLifeMarket.Api.Services.Interfaces;

namespace SecondLifeMarket.Api.Services;

public class AdminAbonnementService : IAdminAbonnementService
{
    // Contexte de base de données.
    private readonly ApplicationDbContext _context;

    // Constructeur du service.
    public AdminAbonnementService(ApplicationDbContext context)
    {
        // On garde le contexte.
        _context = context;
    }

    // Retourne tous les abonnements des membres.
    public async Task<List<AbonnementAdminDto>> GetAbonnementsAsync()
    {
        // On corrige les abonnements expirés avant de retourner la liste.
        await MettreAJourAbonnementsExpiresAsync();

        // On charge les abonnements avec les utilisateurs et les types d'abonnement.
        List<Abonnement> abonnements = await _context.Abonnements
            .Include(abonnement => abonnement.Utilisateur)
            .Include(abonnement => abonnement.TypeAbonnementNavigation)
            .OrderByDescending(abonnement => abonnement.DateDebut)
            .ToListAsync();

        // On transforme les abonnements en DTO.
        return abonnements.Select(ToAbonnementAdminDto).ToList();
    }

    // Retourne tous les types d'abonnement.
    public async Task<List<TypeAbonnementAdminDto>> GetTypesAbonnementAsync()
    {
        // On charge tous les types d'abonnement.
        List<TypeAbonnement> types = await _context.TypesAbonnement
            .OrderBy(type => type.Prix)
            .ToListAsync();

        // On transforme les types en DTO.
        return types.Select(ToTypeAbonnementAdminDto).ToList();
    }

    // Ajoute un type d'abonnement.
    public async Task<TypeAbonnementAdminDto> CreateTypeAbonnementAsync(CreateTypeAbonnementDto dto)
    {
        // On nettoie le nom.
        string nom = dto.Nom.Trim();

        // On nettoie la description.
        string description = dto.Description.Trim();

        // On valide les données.
        ValidateTypeAbonnement(nom, description, dto.Prix, dto.DureeJours, dto.LimitePublication);

        // On vérifie si ce nom existe déjà.
        bool nomExiste = await _context.TypesAbonnement
            .AnyAsync(type => type.Nom.ToLower() == nom.ToLower());

        // On bloque si le nom existe déjà.
        if (nomExiste)
        {
            // On lance une erreur métier.
            throw new InvalidOperationException("Ce type d'abonnement existe déjà.");
        }

        // On crée le type d'abonnement.
        TypeAbonnement typeAbonnement = new()
        {
            // Nom de l'offre.
            Nom = nom,

            // Description de l'offre.
            Description = description,

            // Prix de l'offre.
            Prix = dto.Prix,

            // Durée en jours.
            DureeJours = dto.DureeJours,

            // Limite de publication.
            LimitePublication = dto.LimitePublication,

            // Le type est actif par défaut.
            EstActif = true,

            // Date de création.
            DateCreation = DateTime.UtcNow
        };

        // On ajoute le type dans la base.
        _context.TypesAbonnement.Add(typeAbonnement);

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On retourne le DTO.
        return ToTypeAbonnementAdminDto(typeAbonnement);
    }

    // Modifie un type d'abonnement.
    public async Task<TypeAbonnementAdminDto?> UpdateTypeAbonnementAsync(int id, UpdateTypeAbonnementDto dto)
    {
        // On cherche le type d'abonnement.
        TypeAbonnement? typeAbonnement = await _context.TypesAbonnement
            .FirstOrDefaultAsync(type => type.Id == id);

        // On retourne null s'il n'existe pas.
        if (typeAbonnement == null)
        {
            // Type introuvable.
            return null;
        }

        // On nettoie le nom.
        string nom = dto.Nom.Trim();

        // On nettoie la description.
        string description = dto.Description.Trim();

        // On valide les données.
        ValidateTypeAbonnement(nom, description, dto.Prix, dto.DureeJours, dto.LimitePublication);

        // On vérifie si un autre type porte déjà ce nom.
        bool nomExiste = await _context.TypesAbonnement
            .AnyAsync(type =>
                type.Id != id &&
                type.Nom.ToLower() == nom.ToLower()
            );

        // On bloque si le nom est déjà utilisé par un autre type.
        if (nomExiste)
        {
            // On lance une erreur métier.
            throw new InvalidOperationException("Un autre type d'abonnement utilise déjà ce nom.");
        }

        // On met à jour le nom.
        typeAbonnement.Nom = nom;

        // On met à jour la description.
        typeAbonnement.Description = description;

        // On met à jour le prix.
        typeAbonnement.Prix = dto.Prix;

        // On met à jour la durée.
        typeAbonnement.DureeJours = dto.DureeJours;

        // On met à jour la limite.
        typeAbonnement.LimitePublication = dto.LimitePublication;

        // On met à jour la date de modification.
        typeAbonnement.DateModification = DateTime.UtcNow;

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On retourne le DTO.
        return ToTypeAbonnementAdminDto(typeAbonnement);
    }

    // Active un type d'abonnement.
    public async Task<TypeAbonnementAdminDto?> ActiverTypeAbonnementAsync(int id)
    {
        // On cherche le type d'abonnement.
        TypeAbonnement? typeAbonnement = await _context.TypesAbonnement
            .FirstOrDefaultAsync(type => type.Id == id);

        // On retourne null s'il n'existe pas.
        if (typeAbonnement == null)
        {
            // Type introuvable.
            return null;
        }

        // On active le type.
        typeAbonnement.EstActif = true;

        // On met à jour la date de modification.
        typeAbonnement.DateModification = DateTime.UtcNow;

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On retourne le DTO.
        return ToTypeAbonnementAdminDto(typeAbonnement);
    }

    // Désactive un type d'abonnement.
    public async Task<TypeAbonnementAdminDto?> DesactiverTypeAbonnementAsync(int id)
    {
        // On cherche le type d'abonnement.
        TypeAbonnement? typeAbonnement = await _context.TypesAbonnement
            .FirstOrDefaultAsync(type => type.Id == id);

        // On retourne null s'il n'existe pas.
        if (typeAbonnement == null)
        {
            // Type introuvable.
            return null;
        }

        // On désactive le type.
        typeAbonnement.EstActif = false;

        // On met à jour la date de modification.
        typeAbonnement.DateModification = DateTime.UtcNow;

        // On sauvegarde.
        await _context.SaveChangesAsync();

        // On retourne le DTO.
        return ToTypeAbonnementAdminDto(typeAbonnement);
    }

    // Corrige les abonnements expirés encore marqués actifs.
    private async Task MettreAJourAbonnementsExpiresAsync()
    {
        // On récupère la date actuelle.
        DateTime now = DateTime.UtcNow;

        // On cherche les abonnements expirés encore actifs.
        List<Abonnement> abonnementsExpires = await _context.Abonnements
            .Where(abonnement =>
                abonnement.StatutAbonnement == "Actif" &&
                abonnement.DateFin < now
            )
            .ToListAsync();

        // On parcourt les abonnements expirés.
        foreach (Abonnement abonnement in abonnementsExpires)
        {
            // On marque l'abonnement comme expiré.
            abonnement.StatutAbonnement = "Expiré";
        }

        // On sauvegarde seulement s'il y a des changements.
        if (abonnementsExpires.Count > 0)
        {
            // On sauvegarde en base.
            await _context.SaveChangesAsync();
        }
    }

    // Valide les données d'un type d'abonnement.
    private static void ValidateTypeAbonnement(
        string nom,
        string description,
        decimal prix,
        int dureeJours,
        int limitePublication
    )
    {
        // On vérifie le nom.
        if (string.IsNullOrWhiteSpace(nom))
        {
            // On bloque si le nom est vide.
            throw new InvalidOperationException("Le nom du type d'abonnement est obligatoire.");
        }

        // On vérifie la description.
        if (string.IsNullOrWhiteSpace(description))
        {
            // On bloque si la description est vide.
            throw new InvalidOperationException("La description du type d'abonnement est obligatoire.");
        }

        // On vérifie le prix.
        if (prix < 0)
        {
            // On bloque un prix négatif.
            throw new InvalidOperationException("Le prix ne peut pas être négatif.");
        }

        // On vérifie la durée.
        if (dureeJours <= 0)
        {
            // On bloque une durée invalide.
            throw new InvalidOperationException("La durée doit être supérieure à 0.");
        }

        // On vérifie la limite.
        if (limitePublication <= 0)
        {
            // On bloque une limite invalide.
            throw new InvalidOperationException("La limite de publication doit être supérieure à 0.");
        }
    }

    // Transforme un type d'abonnement en DTO.
    private static TypeAbonnementAdminDto ToTypeAbonnementAdminDto(TypeAbonnement type)
    {
        // On retourne le DTO.
        return new TypeAbonnementAdminDto
        {
            // Identifiant.
            Id = type.Id,

            // Nom.
            Nom = type.Nom,

            // Description.
            Description = type.Description,

            // Prix.
            Prix = type.Prix,

            // Durée.
            DureeJours = type.DureeJours,

            // Limite de publication.
            LimitePublication = type.LimitePublication,

            // État actif.
            EstActif = type.EstActif,

            // Date de création.
            DateCreation = type.DateCreation,

            // Date de modification.
            DateModification = type.DateModification
        };
    }

    // Transforme un abonnement en DTO admin.
    private static AbonnementAdminDto ToAbonnementAdminDto(Abonnement abonnement)
    {
        // On retourne le DTO.
        return new AbonnementAdminDto
        {
            // Identifiant.
            Id = abonnement.Id,

            // Type d'abonnement.
            TypeAbonnement = abonnement.TypeAbonnement,

            // Identifiant du type lié.
            TypeAbonnementId = abonnement.TypeAbonnementId,

            // Date de début.
            DateDebut = abonnement.DateDebut,

            // Date de fin.
            DateFin = abonnement.DateFin,

            // Statut.
            StatutAbonnement = abonnement.StatutAbonnement,

            // Limite de publication.
            LimitePublication = abonnement.LimitePublication,

            // Identifiant du membre.
            UtilisateurId = abonnement.UtilisateurId,

            // Nom complet du membre.
            UtilisateurNomComplet = $"{abonnement.Utilisateur?.Prenom} {abonnement.Utilisateur?.Nom}".Trim(),

            // Email du membre.
            UtilisateurEmail = abonnement.Utilisateur?.Email ?? string.Empty
        };
    }
}