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

// Cette fonction ouvre ou crée une conversation liée à une demande d'achat.
export async function getOrCreateConversationRequest(demandeAchatId, accessToken) {
  // On envoie une requête POST vers le backend.
  const response = await fetch(
    `${API_URL}/Conversations/demande/${demandeAchatId}`,
    {
      // On utilise POST car le backend peut créer une conversation.
      method: "POST",

      // On prépare les informations envoyées dans l'en-tête.
      headers: {
        // On accepte une réponse JSON.
        Accept: "application/json",

        // On envoie le token de l'utilisateur connecté.
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a retourné une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(
      data.message || "Impossible d'ouvrir la conversation."
    );
  }

  // On retourne la conversation.
  return data;
}

// Cette fonction récupère toutes les conversations de l'utilisateur connecté.
export async function getMyConversationsRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/Conversations`, {
    // On utilise GET pour récupérer les conversations.
    method: "GET",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token de l'utilisateur connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse envoyée par le backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a retourné une erreur.
  if (!response.ok) {
    // On lance une erreur avec un message clair.
    throw new Error(
      data.message || "Impossible de charger vos conversations."
    );
  }

  // On retourne la liste des conversations.
  return data;
}