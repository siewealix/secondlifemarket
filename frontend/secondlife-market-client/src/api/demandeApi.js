// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// Cette fonction lit la réponse envoyée par le backend.
async function readResponseData(response) {
  // On lit le contenu de la réponse sous forme de texte.
  const text = await response.text();

  // Si la réponse est vide, on retourne un objet vide.
  if (!text) {
    return {};
  }

  // On transforme le texte JSON en objet JavaScript.
  return JSON.parse(text);
}

// Cette fonction permet de créer une demande d'achat.
export async function createDemandeAchatRequest(annonceId, message, accessToken) {
  // On envoie la requête vers le backend.
  const response = await fetch(`${API_URL}/DemandesAchat`, {
    // On utilise la méthode POST pour créer une nouvelle demande.
    method: "POST",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On précise que les données envoyées sont au format JSON.
      "Content-Type": "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme les données JavaScript en JSON.
    body: JSON.stringify({
      // On envoie l'identifiant de l'annonce.
      annonceId: annonceId,

      // On envoie le message de l'acheteur.
      message: message,
    }),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // Si la réponse est une erreur, on affiche le message du backend.
  if (!response.ok) {
    throw new Error(data.message || "Impossible de créer la demande d'achat.");
  }

  // On retourne la demande créée.
  return data;
}

// Cette fonction récupère les demandes d'achat envoyées par l'acheteur connecté.
export async function getMyDemandesAchatRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/DemandesAchat/mes-demandes`, {
    // On utilise la méthode GET.
    method: "GET",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On accepte une réponse au format JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse envoyée par le backend.
  const data = await readResponseData(response);

  // Si la réponse est une erreur, on lance une erreur claire.
  if (!response.ok) {
    // On affiche le message du backend si disponible.
    throw new Error(data.message || "Impossible de charger vos demandes d'achat.");
  }

  // On retourne la liste des demandes.
  return data;
}

// Cette fonction annule une demande d'achat.
export async function cancelDemandeAchatRequest(demandeId, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/DemandesAchat/${demandeId}/annuler`, {
    // On utilise PUT parce qu'on modifie le statut de la demande.
    method: "PUT",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse envoyée par le backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a retourné une erreur.
  if (!response.ok) {
    // On lance une erreur avec le message du backend.
    throw new Error(data.message || "Impossible d'annuler cette demande d'achat.");
  }

  // On retourne la demande mise à jour.
  return data;
}

// Cette fonction récupère les demandes d'achat reçues par le vendeur connecté.
export async function getDemandesRecuesRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/DemandesAchat/recues`, {
    // On utilise la méthode GET.
    method: "GET",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On accepte une réponse au format JSON.
      Accept: "application/json",

      // On envoie le token du vendeur connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse envoyée par le backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a retourné une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger les demandes reçues.");
  }

  // On retourne la liste des demandes reçues.
  return data;
}

// Cette fonction accepte une demande d'achat.
export async function acceptDemandeAchatRequest(demandeId, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/DemandesAchat/${demandeId}/accepter`, {
    // On utilise PUT parce qu'on modifie le statut de la demande.
    method: "PUT",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On accepte une réponse au format JSON.
      Accept: "application/json",

      // On envoie le token du vendeur connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a retourné une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible d'accepter cette demande d'achat.");
  }

  // On retourne la demande mise à jour.
  return data;
}

// Cette fonction refuse une demande d'achat.
export async function refuseDemandeAchatRequest(demandeId, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/DemandesAchat/${demandeId}/refuser`, {
    // On utilise PUT parce qu'on modifie le statut de la demande.
    method: "PUT",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On accepte une réponse au format JSON.
      Accept: "application/json",

      // On envoie le token du vendeur connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a retourné une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de refuser cette demande d'achat.");
  }

  // On retourne la demande mise à jour.
  return data;
}