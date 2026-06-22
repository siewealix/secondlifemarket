// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// On crée une fonction simple pour lire une réponse JSON.
async function readResponseData(response) {
  // On lit le texte brut de la réponse.
  const text = await response.text();

  // On retourne un objet vide si la réponse est vide.
  if (!text) return {};

  // On transforme le texte JSON en objet JavaScript.
  return JSON.parse(text);
}

// On récupère les catégories actives pour les visiteurs.
export async function getActiveCategoriesRequest() {
  // On envoie une requête GET vers le backend.
  const response = await fetch(`${API_URL}/Categories`, {
    // On utilise la méthode GET.
    method: "GET",

    // On indique que l'on attend du JSON.
    headers: {
      // On accepte le JSON.
      Accept: "application/json",
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On lance une erreur lisible.
    throw new Error(data.message || "Impossible de charger les catégories.");
  }

  // On retourne les catégories.
  return data;
}

// On récupère toutes les catégories pour l'administrateur.
export async function getAdminCategoriesRequest(accessToken) {
  // On envoie une requête GET protégée.
  const response = await fetch(`${API_URL}/Categories/admin`, {
    // On utilise la méthode GET.
    method: "GET",

    // On envoie le token administrateur.
    headers: {
      // On accepte le JSON.
      Accept: "application/json",

      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On lance une erreur lisible.
    throw new Error(data.message || "Impossible de charger les catégories administrateur.");
  }

  // On retourne les catégories.
  return data;
}

// On crée une catégorie.
export async function createCategoryRequest(categoryData, accessToken) {
  // On envoie une requête POST protégée.
  const response = await fetch(`${API_URL}/Categories`, {
    // On utilise la méthode POST.
    method: "POST",

    // On envoie les headers nécessaires.
    headers: {
      // On précise que le contenu est du JSON.
      "Content-Type": "application/json",

      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme les données en JSON.
    body: JSON.stringify(categoryData),
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si la création a échoué.
  if (!response.ok) {
    // On lance une erreur lisible.
    throw new Error(data.message || "Impossible de créer la catégorie.");
  }

  // On retourne la catégorie créée.
  return data;
}

// On modifie une catégorie.
export async function updateCategoryRequest(categoryId, categoryData, accessToken) {
  // On envoie une requête PUT protégée.
  const response = await fetch(`${API_URL}/Categories/${categoryId}`, {
    // On utilise la méthode PUT.
    method: "PUT",

    // On envoie les headers nécessaires.
    headers: {
      // On précise que le contenu est du JSON.
      "Content-Type": "application/json",

      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme les données en JSON.
    body: JSON.stringify(categoryData),
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si la modification a échoué.
  if (!response.ok) {
    // On lance une erreur lisible.
    throw new Error(data.message || "Impossible de modifier la catégorie.");
  }

  // On retourne la catégorie modifiée.
  return data;
}

// On désactive une catégorie.
export async function deleteCategoryRequest(categoryId, accessToken) {
  // On envoie une requête DELETE protégée.
  const response = await fetch(`${API_URL}/Categories/${categoryId}`, {
    // On utilise la méthode DELETE.
    method: "DELETE",

    // On envoie le token.
    headers: {
      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse.
  const data = await readResponseData(response);

  // On vérifie si la suppression a échoué.
  if (!response.ok) {
    // On lance une erreur lisible.
    throw new Error(data.message || "Impossible de désactiver la catégorie.");
  }

  // On retourne le message du backend.
  return data;
}