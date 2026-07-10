// On importe IFormFile.
using Microsoft.AspNetCore.Http;

// On place ce fichier dans le namespace DTOs Annonces.
namespace SecondLifeMarket.Api.DTOs.Annonces;

// On crée le DTO pour recevoir une photo.
public class UploadPhotoDto
{
    // On reçoit le fichier envoyé depuis Swagger ou React.
    public IFormFile? Photo { get; set; }
}