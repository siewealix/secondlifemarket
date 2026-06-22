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
        policy.WithOrigins("https://localhost:5173")
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

// On active CORS.
app.UseCors("ReactClient");

// On active l'authentification.
app.UseAuthentication();

// On active l'autorisation.
app.UseAuthorization();

// On relie les contrôleurs.
app.MapControllers();

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