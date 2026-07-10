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

  // On transforme le texte JSON en objet JavaScript.
  return JSON.parse(text);
}

// Cette fonction récupère les offres d'abonnement.
export async function getOffresAbonnementRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/Abonnements/offres`, {
    // On utilise GET pour récupérer les offres.
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
    throw new Error(data.message || "Impossible de charger les offres d'abonnement.");
  }

  // On retourne les offres.
  return data;
}

// Cette fonction récupère l'abonnement actuel du membre.
export async function getMonAbonnementRequest(accessToken) {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/Abonnements/mon-abonnement`, {
    // On utilise GET pour récupérer l'abonnement.
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
    throw new Error(data.message || "Impossible de charger votre abonnement.");
  }

  // On retourne l'abonnement.
  return data;
}

// Cette fonction permet de souscrire à une offre.
export async function souscrireAbonnementRequest(typeAbonnement, accessToken) {
  // On envoie une requête POST vers le backend.
  const response = await fetch(`${API_URL}/Abonnements/souscrire`, {
    // On utilise POST pour créer une souscription.
    method: "POST",

    // On prépare les en-têtes.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On envoie le type d'abonnement choisi.
    body: JSON.stringify({
      // Type choisi.
      typeAbonnement: typeAbonnement,
    }),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de souscrire à cet abonnement.");
  }

  // On retourne l'abonnement créé.
  return data;
}

// Cette fonction permet de résilier l'abonnement du membre connecté.
export async function resilierAbonnementRequest(accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/Abonnements/resilier`, {
    // On utilise PUT pour modifier l'état de l'abonnement.
    method: "PUT",

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
    throw new Error(data.message || "Impossible de résilier votre abonnement.");
  }

  // On retourne la nouvelle situation de l'abonnement.
  return data;
}