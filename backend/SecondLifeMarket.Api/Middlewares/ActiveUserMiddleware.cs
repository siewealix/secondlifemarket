using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SecondLifeMarket.Api.Data;

namespace SecondLifeMarket.Api.Middlewares;

public class ActiveUserMiddleware
{
    // Middleware suivant dans la chaîne.
    private readonly RequestDelegate _next;

    // Constructeur du middleware.
    public ActiveUserMiddleware(RequestDelegate next)
    {
        // On garde le middleware suivant.
        _next = next;
    }

    // Méthode exécutée à chaque requête.
    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        // On vérifie si l'utilisateur est connecté.
        bool isAuthenticated = context.User?.Identity?.IsAuthenticated == true;

        // Si l'utilisateur n'est pas connecté, on laisse passer.
        if (!isAuthenticated)
        {
            // On continue vers la suite.
            await _next(context);

            // On arrête ici.
            return;
        }

        // On récupère l'identifiant de l'utilisateur depuis le token.
        string? userIdValue = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? context.User.FindFirstValue("id")
            ?? context.User.FindFirstValue("userId");

        // On vérifie si l'identifiant est absent ou invalide.
        if (string.IsNullOrWhiteSpace(userIdValue) || !int.TryParse(userIdValue, out int userId))
        {
            // On retourne une erreur 401.
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            // On précise que la réponse est en JSON.
            context.Response.ContentType = "application/json";

            // On écrit le message d'erreur.
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Utilisateur non authentifié."
            });

            // On arrête la requête.
            return;
        }

        // On vérifie si l'utilisateur existe et si son compte est actif.
        bool utilisateurActif = await dbContext.Utilisateurs
            .AnyAsync(utilisateur =>
                utilisateur.Id == userId &&
                utilisateur.EstActif
            );

        // Si le compte n'est pas actif, on bloque.
        if (!utilisateurActif)
        {
            // On retourne une erreur 403.
            context.Response.StatusCode = StatusCodes.Status403Forbidden;

            // On précise que la réponse est en JSON.
            context.Response.ContentType = "application/json";

            // On écrit le message d'erreur.
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Votre compte a été suspendu. Vous ne pouvez plus utiliser la plateforme."
            });

            // On arrête la requête.
            return;
        }

        // Si le compte est actif, on continue normalement.
        await _next(context);
    }
}