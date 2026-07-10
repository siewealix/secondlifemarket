// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// Cette fonction lit la réponse envoyée par le backend.
async function readResponseData(response) {
  // On lit la réponse sous forme de texte.
  const text = await response.text();

  // Si la réponse est vide, on retourne un objet vide.
  if (!text) {
    return {};
  }

  // On transforme le JSON en objet JavaScript.
  return JSON.parse(text);
}

// Cette fonction envoie un message dans une conversation.
export async function sendMessageRequest(conversationId, contenu, accessToken) {
  // On envoie une requête POST vers le backend.
  const response = await fetch(`${API_URL}/Messages/conversation/${conversationId}`, {
    // On utilise POST pour créer un nouveau message.
    method: "POST",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token de l'utilisateur connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme le message en JSON.
    body: JSON.stringify({
      // On envoie le contenu du message.
      contenu: contenu,
    }),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // Si le backend retourne une erreur, on lance une erreur claire.
  if (!response.ok) {
    throw new Error(data.message || "Impossible d'envoyer le message.");
  }

  // On retourne le message créé.
  return data;
}