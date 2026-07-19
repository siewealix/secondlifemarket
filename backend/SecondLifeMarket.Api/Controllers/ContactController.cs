// On importe les outils nécessaires
// pour créer un contrôleur API.
using Microsoft.AspNetCore.Mvc;

// On importe le système de journalisation d’ASP.NET.
using Microsoft.Extensions.Logging;

// On importe le DTO du formulaire de contact.
using SecondLifeMarket.Api.DTOs.Contact;

// On importe l’interface du service d’e-mail.
using SecondLifeMarket.Api.Services.Interfaces;

// On indique que cette classe appartient
// au dossier Controllers.
namespace SecondLifeMarket.Api.Controllers;

// On indique qu’il s’agit d’un contrôleur API.
[ApiController]

// Cette route deviendra : /api/Contact
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    // On conserve le service d’e-mail
    // dans une variable privée.
    private readonly IEmailService _emailService;

    // Ce logger affichera les erreurs techniques
    // uniquement dans le terminal du backend.
    private readonly ILogger<ContactController> _logger;

    // ASP.NET fournit automatiquement
    // le service d’e-mail et le logger.
    public ContactController(
        IEmailService emailService,
        ILogger<ContactController> logger
    )
    {
        // On conserve le service d’e-mail.
        _emailService = emailService;

        // On conserve le logger.
        _logger = logger;
    }

    // Cette méthode répond aux requêtes POST
    // envoyées vers /api/Contact.
    [HttpPost]
    public async Task<IActionResult> SendContactMessage(
        ContactMessageDto dto
    )
    {
        // On essaie d’envoyer le message.
        try
        {
            // On appelle le service d’e-mail
            // avec les données reçues du frontend.
            await _emailService.SendContactEmailAsync(
                dto.Name.Trim(),
                dto.Email.Trim(),
                dto.Subject.Trim(),
                dto.Message.Trim()
            );

            // On retourne une réponse positive au frontend.
            return Ok(
                new
                {
                    message = "Votre message a été envoyé avec succès."
                }
            );
        }
        catch (Exception error)
        {
            // On affiche l’erreur technique dans le terminal.
            _logger.LogError(
                error,
                "Erreur pendant l’envoi du formulaire de contact."
            );

            // On retourne un message général au frontend.
            return StatusCode(
                500,
                new
                {
                    message = "Impossible d’envoyer le message pour le moment."
                }
            );
        }
    }
}