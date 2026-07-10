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

  // On transforme le texte JSON en objet JavaScript.
  return JSON.parse(text);
}

// Cette fonction permet de signaler une annonce.
export async function createSignalementAnnonceRequest(annonceId, signalementData, accessToken) {
  // On envoie la requête vers le backend.
  const response = await fetch(`${API_URL}/Signalements/annonce/${annonceId}`, {
    // On utilise POST pour créer un signalement.
    method: "POST",

    // On prépare les informations envoyées dans l'en-tête.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme les données en JSON.
    body: JSON.stringify(signalementData),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // Si le backend retourne une erreur, on lance une erreur.
  if (!response.ok) {
    throw new Error(data.message || "Impossible de signaler cette annonce.");
  }

  // On retourne le signalement créé.
  return data;
}

// Cette fonction permet de signaler un utilisateur depuis une conversation.
export async function createSignalementUtilisateurRequest(
  conversationId,
  utilisateurSignaleId,
  signalementData,
  accessToken
) {
  // On envoie la requête vers le backend.
  const response = await fetch(
    `${API_URL}/Signalements/conversation/${conversationId}/utilisateur/${utilisateurSignaleId}`,
    {
      // On utilise POST pour créer un signalement.
      method: "POST",

      // On prépare les informations envoyées dans l'en-tête.
      headers: {
        // On précise que les données envoyées sont en JSON.
        "Content-Type": "application/json",

        // On accepte une réponse JSON.
        Accept: "application/json",

        // On envoie le token du membre connecté.
        Authorization: `Bearer ${accessToken}`,
      },

      // On transforme les données en JSON.
      body: JSON.stringify(signalementData),
    }
  );

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // Si le backend retourne une erreur, on lance une erreur.
  if (!response.ok) {
    throw new Error(data.message || "Impossible de signaler cet utilisateur.");
  }

  // On retourne le signalement créé.
  return data;
}

// Cette fonction récupère les signalements d'annonces pour l'administrateur.
export async function getSignalementsAnnoncesAdminRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/Signalements/admin/annonces`, {
    // On utilise la méthode GET.
    method: "GET",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token de l'administrateur connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la réponse est une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger les signalements d'annonces.");
  }

  // On retourne les signalements.
  return data;
}

// Cette fonction récupère les signalements d'utilisateurs pour l'administrateur.
export async function getSignalementsUtilisateursAdminRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/Signalements/admin/utilisateurs`, {
    // On utilise la méthode GET.
    method: "GET",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token de l'administrateur connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la réponse est une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger les signalements d'utilisateurs.");
  }

  // On retourne les signalements.
  return data;
}

// Cette fonction traite un signalement d'annonce.
export async function traiterSignalementAnnonceRequest(signalementId, action, decisionAdmin, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/Signalements/admin/annonces/${signalementId}/${action}`, {
    // On utilise PUT parce qu'on modifie le statut du signalement.
    method: "PUT",

    // On prépare les en-têtes.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token de l'administrateur connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On envoie la décision de l'administrateur.
    body: JSON.stringify({
      // On envoie la remarque admin.
      decisionAdmin: decisionAdmin,
    }),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la réponse est une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de traiter ce signalement d'annonce.");
  }

  // On retourne le signalement traité.
  return data;
}

// Cette fonction traite un signalement d'utilisateur.
export async function traiterSignalementUtilisateurRequest(signalementId, action, decisionAdmin, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/Signalements/admin/utilisateurs/${signalementId}/${action}`, {
    // On utilise PUT parce qu'on modifie le statut du signalement.
    method: "PUT",

    // On prépare les en-têtes.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token de l'administrateur connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On envoie la décision de l'administrateur.
    body: JSON.stringify({
      // On envoie la remarque admin.
      decisionAdmin: decisionAdmin,
    }),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la réponse est une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de traiter ce signalement d'utilisateur.");
  }

  // On retourne le signalement traité.
  return data;
}

