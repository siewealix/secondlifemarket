// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// Cette fonction lit la réponse envoyée par le backend.
async function readResponseData(response) {
  // On lit la réponse sous forme de texte.
  const text = await response.text();

  // Si la réponse est vide, on retourne un objet vide.
  if (!text) {
    // On retourne un objet vide.
    return {};
  }

  // On transforme le JSON en objet JavaScript.
  return JSON.parse(text);
}

// Cette fonction récupère les statistiques du tableau de bord vendeur.
export async function getVendeurDashboardRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/TableauBord/vendeur`, {
    // On utilise GET pour récupérer les statistiques.
    method: "GET",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger le tableau de bord vendeur.");
  }

  // On retourne les statistiques.
  return data;
}

// Cette fonction récupère les statistiques du tableau de bord acheteur.
export async function getAcheteurDashboardRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/TableauBord/acheteur`, {
    // On utilise GET pour récupérer les statistiques.
    method: "GET",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger le tableau de bord acheteur.");
  }

  // On retourne les statistiques.
  return data;
}


// Cette fonction récupère les statistiques du tableau de bord administrateur.
export async function getAdminDashboardRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/TableauBord/admin`, {
    // On utilise GET pour récupérer les statistiques.
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

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger le tableau de bord administrateur.");
  }

  // On retourne les statistiques.
  return data;
}