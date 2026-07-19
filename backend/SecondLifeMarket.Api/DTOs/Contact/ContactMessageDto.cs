// On importe les outils permettant
// de valider les données reçues.
using System.ComponentModel.DataAnnotations;

// On indique que ce DTO appartient
// au dossier DTOs/Contact.
namespace SecondLifeMarket.Api.DTOs.Contact;

// Ce DTO représente les données envoyées
// depuis le formulaire de contact React.
public class ContactMessageDto
{
    // Le nom du visiteur est obligatoire.
    [Required(ErrorMessage = "Le nom est obligatoire.")]

    // Le nom ne doit pas dépasser 100 caractères.
    [MaxLength(
        100,
        ErrorMessage = "Le nom ne doit pas dépasser 100 caractères."
    )]

    // Cette propriété recevra le champ "name" du frontend.
    public string Name { get; set; } = string.Empty;

    // L’adresse e-mail est obligatoire.
    [Required(ErrorMessage = "L’adresse e-mail est obligatoire.")]

    // On vérifie que l’adresse possède un format valide.
    [EmailAddress(
        ErrorMessage = "L’adresse e-mail n’est pas valide."
    )]

    // Cette propriété recevra le champ "email" du frontend.
    public string Email { get; set; } = string.Empty;

    // Le sujet est obligatoire.
    [Required(ErrorMessage = "Le sujet est obligatoire.")]

    // Le sujet ne doit pas dépasser 150 caractères.
    [MaxLength(
        150,
        ErrorMessage = "Le sujet ne doit pas dépasser 150 caractères."
    )]

    // Cette propriété recevra le champ "subject" du frontend.
    public string Subject { get; set; } = string.Empty;

    // Le message est obligatoire.
    [Required(ErrorMessage = "Le message est obligatoire.")]

    // On reprend la limite de 2 000 caractères
    // déjà utilisée dans SendMessageDto.
    [MaxLength(
        2000,
        ErrorMessage = "Le message ne doit pas dépasser 2 000 caractères."
    )]

    // Cette propriété recevra le champ "message" du frontend.
    public string Message { get; set; } = string.Empty;
}