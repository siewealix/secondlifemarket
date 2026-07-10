// On importe tout le client SignalR.
import * as signalR from "@microsoft/signalr";

// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// On transforme l'URL API en URL backend sans /api.
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

// On construit l'URL du hub SignalR.
const HUB_URL = `${BACKEND_URL}/hubs/messages`;

// Cette fonction crée une connexion SignalR vers le hub des messages.
export function createMessageHubConnection(accessToken) {
  // On crée et retourne une nouvelle connexion SignalR.
  return new signalR.HubConnectionBuilder()
    // On indique l'URL du hub et la manière d'envoyer le token JWT.
    .withUrl(HUB_URL, {
      // SignalR appellera cette fonction pour récupérer le token.
      accessTokenFactory: () => accessToken,
    })

    // On active la reconnexion automatique en cas de petite coupure.
    .withAutomaticReconnect()

    // On construit la connexion.
    .build();
}