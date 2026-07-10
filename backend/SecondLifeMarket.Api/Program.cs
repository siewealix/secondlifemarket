// On importe l'authentification JWT.
using Microsoft.AspNetCore.Authentication.JwtBearer;

// On importe les outils Swagger pour configurer le bouton Authorize.
using Microsoft.OpenApi.Models;

// On importe Entity Framework.
using Microsoft.EntityFrameworkCore;

// On importe les paramètres de sécurité JWT.
using Microsoft.IdentityModel.Tokens;

// On importe l'encodage.
using System.Text;

// On importe la base de données.
using SecondLifeMarket.Api.Data;

// On importe les helpers.
using SecondLifeMarket.Api.Helpers;

// On importe les services.
using SecondLifeMarket.Api.Services;

// On importe les interfaces.
using SecondLifeMarket.Api.Services.Interfaces;
using SecondLifeMarket.Api.Hubs;

using SecondLifeMarket.Api.Middlewares;

// On crée le builder de l'application.
var builder = WebApplication.CreateBuilder(args);

// On ajoute les contrôleurs.
builder.Services.AddControllers();

// On ajoute Swagger pour tester l'API.
builder.Services.AddEndpointsApiExplorer();

// On configure Swagger.
builder.Services.AddSwaggerGen(options =>
{
    // On ajoute une sécurité appelée Bearer.
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        // On explique à l'utilisateur quoi saisir.
        Description = "Entrez votre token JWT sous cette forme : Bearer votre_token",

        // On indique que le token sera envoyé dans le header HTTP.
        In = ParameterLocation.Header,

        // On indique le nom du header utilisé.
        Name = "Authorization",

        // On indique que Swagger doit envoyer une clé dans le header.
        Type = SecuritySchemeType.ApiKey,

        // On indique que le schéma utilisé est Bearer.
        Scheme = "Bearer"
    });

    // On indique que les routes protégées peuvent utiliser ce token.
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        // On ajoute la règle de sécurité.
        {
            // On définit la référence vers la sécurité Bearer.
            new OpenApiSecurityScheme
            {
                // On indique que c'est une référence.
                Reference = new OpenApiReference
                {
                    // On indique que la référence est une sécurité.
                    Type = ReferenceType.SecurityScheme,

                    // On donne le nom de la sécurité.
                    Id = "Bearer"
                }
            },

            // On laisse la liste vide car on n'utilise pas de scopes.
            Array.Empty<string>()
        }
    });
});

// On récupère la chaîne de connexion.
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

// On ajoute MySQL avec Pomelo.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// On autorise le frontend React à appeler l'API.
builder.Services.AddCors(options =>
{
    // On crée une politique CORS.
    options.AddPolicy("ReactClient", policy =>
    {
        // On indique l'adresse du frontend React en HTTPS.
        policy.WithOrigins("https://localhost:5173", "https://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// On ajoute JwtHelper dans les services.
builder.Services.AddScoped<JwtHelper>();

// On ajoute le service d'authentification.
builder.Services.AddScoped<IAuthService, AuthService>();

// On ajoute le service des catégories.
builder.Services.AddScoped<ICategorieService, CategorieService>();

// On ajoute le service des annonces.
builder.Services.AddScoped<IAnnonceService, AnnonceService>();

// On ajoute le service d'analyse IA des annonces.
builder.Services.AddHttpClient<IAiAnnonceAnalysisService, AiAnnonceAnalysisService>();

// On ajoute le service des demandes d'achat.
builder.Services.AddScoped<IDemandeAchatService, DemandeAchatService>();

// On ajoute le service des conversations.
builder.Services.AddScoped<IConversationService, ConversationService>();

// On ajoute le service des messages.
builder.Services.AddScoped<IMessageService, MessageService>();

// On ajoute SignalR pour la messagerie instantanée.
builder.Services.AddSignalR();

// On ajoute le service des signalements.
builder.Services.AddScoped<ISignalementService, SignalementService>();

// On ajoute le service admin pour gérer les utilisateurs.
builder.Services.AddScoped<IAdminUtilisateurService, AdminUtilisateurService>();

// On ajoute le service des abonnements.
builder.Services.AddScoped<IAbonnementService, AbonnementService>();

builder.Services.AddScoped<ITableauBordService, TableauBordService>();

// On récupère la clé JWT.
string jwtKey = builder.Configuration["Jwt:Key"]!;

// On transforme la clé JWT en bytes.
byte[] jwtKeyBytes = Encoding.UTF8.GetBytes(jwtKey);

// On configure l'authentification JWT.
builder.Services.AddAuthentication(options =>
{
    // On définit le schéma d'authentification.
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

    // On définit le schéma de challenge.
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // On définit les paramètres de validation du token.
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // On vérifie l'émetteur du token.
        ValidateIssuer = true,

        // On vérifie l'audience du token.
        ValidateAudience = true,

        // On vérifie la durée de vie du token.
        ValidateLifetime = true,

        // On vérifie la clé de signature.
        ValidateIssuerSigningKey = true,

        // On définit l'émetteur valide.
        ValidIssuer = builder.Configuration["Jwt:Issuer"],

        // On définit l'audience valide.
        ValidAudience = builder.Configuration["Jwt:Audience"],

        // On définit la clé de signature.
        IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes)
    };

    // On permet à SignalR de lire le token envoyé dans la query string.
    options.Events = new JwtBearerEvents
    {
        // Cette méthode est appelée quand ASP.NET Core reçoit une requête authentifiée.
        OnMessageReceived = context =>
        {
            // On récupère le token envoyé par SignalR.
            string? accessToken = context.Request.Query["access_token"];

            // On récupère le chemin demandé.
            PathString path = context.HttpContext.Request.Path;

            // On vérifie si la requête concerne notre hub SignalR.
            if (!string.IsNullOrWhiteSpace(accessToken) && path.StartsWithSegments("/hubs/messages"))
            {
                // On donne le token à ASP.NET Core pour authentifier l'utilisateur.
                context.Token = accessToken;
            }

            // On termine la méthode.
            return Task.CompletedTask;
        }
    };
});

// On ajoute l'autorisation.
builder.Services.AddAuthorization();

// On construit l'application.
var app = builder.Build();

// On active Swagger en développement.
if (app.Environment.IsDevelopment())
{
    // On active Swagger.
    app.UseSwagger();

    // On active l'interface Swagger.
    app.UseSwaggerUI();
}

// On active HTTPS.
app.UseHttpsRedirection();

// On ajoute des headers de sécurité aux réponses HTTP.
app.Use(async (context, next) =>
{
    // On empêche le navigateur de deviner un autre type de contenu.
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";

    // On empêche l'affichage de l'API dans une iframe.
    context.Response.Headers["X-Frame-Options"] = "DENY";

    // On limite les informations envoyées dans le header Referer.
    context.Response.Headers["Referrer-Policy"] = "no-referrer";

    // On désactive certaines permissions navigateur inutiles pour l'API.
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";

    // On applique une politique CSP stricte hors Swagger.
    if (!context.Request.Path.StartsWithSegments("/swagger"))
    {
        // On empêche le chargement de ressources externes par défaut.
        context.Response.Headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'; base-uri 'none';";
    }

    // On passe à la suite du traitement de la requête.
    await next();
});

// On autorise l'accès aux fichiers du dossier wwwroot.
app.UseStaticFiles();

// On active CORS.
app.UseCors("ReactClient");

// On active l'authentification JWT.
app.UseAuthentication();

// On vérifie que le compte connecté est encore actif.
app.UseMiddleware<ActiveUserMiddleware>();

// On active les autorisations par rôle.
app.UseAuthorization();

// On relie les contrôleurs.
app.MapControllers();

// On expose le hub SignalR de messagerie.
app.MapHub<MessageHub>("/hubs/messages");

// On initialise la base au démarrage.
using (IServiceScope scope = app.Services.CreateScope())
{
    // On récupère le contexte.
    ApplicationDbContext context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // On applique les migrations.
    await context.Database.MigrateAsync();

    // On insère les données de test.
    await DbInitializer.SeedAsync(context);
}

// On lance l'application.
app.Run();