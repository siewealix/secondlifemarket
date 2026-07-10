// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// Cette fonction lit la réponse du backend.
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

// Cette fonction récupère tous les abonnements des membres.
export async function getAdminAbonnementsRequest(accessToken) {
  // On envoie une requête GET au backend.
  const response = await fetch(`${API_URL}/admin/abonnements`, {
    // On utilise GET.
    method: "GET",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger les abonnements.");
  }

  // On retourne les abonnements.
  return data;
}

// Cette fonction récupère tous les types d'abonnement.
export async function getAdminTypesAbonnementRequest(accessToken) {
  // On envoie une requête GET au backend.
  const response = await fetch(`${API_URL}/admin/abonnements/types`, {
    // On utilise GET.
    method: "GET",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger les types d'abonnement.");
  }

  // On retourne les types.
  return data;
}

// Cette fonction ajoute un nouveau type d'abonnement.
export async function createAdminTypeAbonnementRequest(formData, accessToken) {
  // On envoie une requête POST au backend.
  const response = await fetch(`${API_URL}/admin/abonnements/types`, {
    // On utilise POST pour créer.
    method: "POST",

    // On prépare les en-têtes.
    headers: {
      // On indique que les données sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token administrateur.
      Authorization: `Bearer ${accessToken}`,
    },

    // On envoie les données du formulaire.
    body: JSON.stringify(formData),
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible d'ajouter ce type d'abonnement.");
  }

  // On retourne le type créé.
  return data;
}

// Cette fonction modifie un type d'abonnement.
export async function updateAdminTypeAbonnementRequest(typeId, formData, accessToken) {
  // On envoie une requête PUT au backend.
  const response = await fetch(`${API_URL}/admin/abonnements/types/${typeId}`, {
    // On utilise PUT pour modifier.
    method: "PUT",

    // On prépare les en-têtes.
    headers: {
      // On indique que les données sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token administrateur.
      Authorization: `Bearer ${accessToken}`,
    },

    // On envoie les données du formulaire.
    body: JSON.stringify(formData),
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de modifier ce type d'abonnement.");
  }

  // On retourne le type modifié.
  return data;
}

// Cette fonction active un type d'abonnement.
export async function activerAdminTypeAbonnementRequest(typeId, accessToken) {
  // On envoie une requête PUT au backend.
  const response = await fetch(`${API_URL}/admin/abonnements/types/${typeId}/activer`, {
    // On utilise PUT pour activer.
    method: "PUT",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible d'activer ce type d'abonnement.");
  }

  // On retourne le type activé.
  return data;
}

// Cette fonction désactive un type d'abonnement.
export async function desactiverAdminTypeAbonnementRequest(typeId, accessToken) {
  // On envoie une requête PUT au backend.
  const response = await fetch(`${API_URL}/admin/abonnements/types/${typeId}/desactiver`, {
    // On utilise PUT pour désactiver.
    method: "PUT",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de désactiver ce type d'abonnement.");
  }

  // On retourne le type désactivé.
  return data;
}