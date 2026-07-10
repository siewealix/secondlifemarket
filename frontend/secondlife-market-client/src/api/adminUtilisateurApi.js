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

// Cette fonction récupère la liste des membres pour l'administrateur.
export async function getAdminUtilisateursRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/admin/utilisateurs`, {
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
    throw new Error(data.message || "Impossible de charger les membres.");
  }

  // On retourne la liste des membres.
  return data;
}

// Cette fonction suspend un membre.
export async function suspendreUtilisateurRequest(utilisateurId, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/admin/utilisateurs/${utilisateurId}/suspendre`, {
    // On utilise PUT pour modifier l'état du compte.
    method: "PUT",

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
    throw new Error(data.message || "Impossible de suspendre ce membre.");
  }

  // On retourne le membre modifié.
  return data;
}

// Cette fonction réactive un membre.
export async function reactiverUtilisateurRequest(utilisateurId, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/admin/utilisateurs/${utilisateurId}/reactiver`, {
    // On utilise PUT pour modifier l'état du compte.
    method: "PUT",

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
    throw new Error(data.message || "Impossible de réactiver ce membre.");
  }

  // On retourne le membre modifié.
  return data;
}