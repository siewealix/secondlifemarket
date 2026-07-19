// On indique que cette interface appartient
// au dossier Services/Interfaces.
namespace SecondLifeMarket.Api.Services.Interfaces;

// Cette interface définit les actions
// disponibles pour l’envoi des e-mails.
public interface IEmailService
{
    // Cette méthode enverra le message
    // provenant du formulaire de contact.
    Task SendContactEmailAsync(
        // Nom saisi par le visiteur.
        string visitorName,

        // Adresse e-mail saisie par le visiteur.
        string visitorEmail,

        // Sujet du message.
        string subject,

        // Contenu du message.
        string message
    );
}