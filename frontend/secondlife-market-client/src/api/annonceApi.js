// On récupère l'adresse de base de l'API depuis le fichier .env.
const API_URL = import.meta.env.VITE_API_URL;

// On crée l'adresse de base pour afficher les fichiers.
const FILE_URL = API_URL.replace(/\/api\/?$/, "");

// On transforme une URL relative en URL complète.
export function getPhotoUrl(url) {
  // On retourne une chaîne vide si aucune photo n'existe.
  if (!url) return "";

  // On retourne directement l'URL si elle est déjà complète.
  if (url.startsWith("http")) return url;

  // On ajoute l'adresse du backend devant l'URL de la photo.
  return `${FILE_URL}${url}`;
}

// On crée une fonction simple pour lire la réponse du backend.
async function readResponseData(response) {
  // On lit le texte brut de la réponse.
  const text = await response.text();

  // On retourne un objet vide si la réponse est vide.
  if (!text) return {};

  // On transforme le texte JSON en objet JavaScript.
  return JSON.parse(text);
}

// On récupère toutes les annonces publiques.
export async function getPublicAnnoncesRequest() {
  // On appelle la route publique des annonces.
  const response = await fetch(`${API_URL}/Annonces`, {
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
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger les annonces.");
  }

  // On retourne les annonces.
  return data;
}

// On récupère le détail d'une annonce.
export async function getAnnonceByIdRequest(id) {
  // On appelle la route détail.
  const response = await fetch(`${API_URL}/Annonces/${id}`, {
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
    // On lance une erreur claire.
    throw new Error(data.message || "Annonce introuvable.");
  }

  // On retourne l'annonce.
  return data;
}

// On crée une annonce depuis l'espace membre.
export async function createAnnonceRequest(annonceData, accessToken) {
  // On envoie une requête POST vers le backend.
  const response = await fetch(`${API_URL}/Annonces`, {
    // On utilise la méthode POST.
    method: "POST",

    // On envoie les headers nécessaires.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On ajoute le token JWT du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme l'annonce en JSON.
    body: JSON.stringify(annonceData),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de publier l'annonce.");
  }

  // On retourne l'annonce créée.
  return data;
}

// On récupère les annonces du membre connecté.
export async function getMyAnnoncesRequest(accessToken) {
  // On envoie une requête GET protégée.
  const response = await fetch(`${API_URL}/Annonces/mes-annonces`, {
    // On utilise la méthode GET.
    method: "GET",

    // On envoie les headers nécessaires.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de charger vos annonces.");
  }

  // On retourne les annonces du membre.
  return data;
}

// On désactive une annonce du membre connecté.
export async function deleteAnnonceRequest(annonceId, accessToken) {
  // On envoie une requête DELETE vers le backend.
  const response = await fetch(`${API_URL}/Annonces/${annonceId}`, {
    // On utilise la méthode DELETE.
    method: "DELETE",

    // On envoie le token JWT.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On ajoute le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de désactiver l'annonce.");
  }

  // On retourne la réponse du backend.
  return data;
}

// On modifie une annonce existante.
export async function updateAnnonceRequest(annonceId, annonceData, accessToken) {
  // On envoie une requête PUT vers le backend.
  const response = await fetch(`${API_URL}/Annonces/${annonceId}`, {
    // On utilise la méthode PUT.
    method: "PUT",

    // On envoie les headers nécessaires.
    headers: {
      // On précise que les données envoyées sont en JSON.
      "Content-Type": "application/json",

      // On accepte une réponse JSON.
      Accept: "application/json",

      // On ajoute le token JWT du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },

    // On transforme les données en JSON.
    body: JSON.stringify(annonceData),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de modifier l'annonce.");
  }

  // On retourne l'annonce modifiée.
  return data;
}

// On ajoute une photo à une annonce.
export async function uploadAnnoncePhotoRequest(annonceId, photo, accessToken) {
  // On crée un formulaire spécial pour envoyer un fichier.
  const formData = new FormData();

  // On ajoute la photo dans le formulaire.
  formData.append("Photo", photo);

  // On envoie la photo au backend.
  const response = await fetch(`${API_URL}/Annonces/${annonceId}/photos`, {
    // On utilise la méthode POST.
    method: "POST",

    // On ajoute seulement le token.
    headers: {
      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },

    // On envoie le fichier.
    body: formData,
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si l'envoi a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible d'ajouter la photo.");
  }

  // On retourne la photo créée.
  return data;
}

// On supprime une photo d'une annonce.
export async function deleteAnnoncePhotoRequest(annonceId, photoId, accessToken) {
  // On envoie une requête DELETE vers le backend.
  const response = await fetch(`${API_URL}/Annonces/${annonceId}/photos/${photoId}`, {
    // On utilise la méthode DELETE.
    method: "DELETE",

    // On envoie les headers nécessaires.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la suppression a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de supprimer la photo.");
  }

  // On retourne la réponse.
  return data;
}


// On finalise la publication d'une annonce.
export async function publishAnnonceRequest(annonceId, accessToken) {
  // On envoie une requête POST vers le backend.
  const response = await fetch(`${API_URL}/Annonces/${annonceId}/publier`, {
    // On utilise la méthode POST.
    method: "POST",

    // On envoie les headers nécessaires.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la publication a échoué.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de publier l'annonce.");
  }

  // On retourne l'annonce après publication ou analyse IA.
  return data;
}


// Cette fonction récupère les annonces en attente de réexamen par l'administrateur.
export async function getAdminReviewAnnoncesRequest(accessToken) {
  // On envoie une requête GET vers la route admin des annonces en réexamen.
  const response = await fetch(`${API_URL}/Annonces/admin/reexamen`, {
    // On indique que la méthode HTTP est GET.
    method: "GET",

    // On prépare les en-têtes de la requête.
    headers: {
      // On indique que le frontend attend du JSON.
      Accept: "application/json",

      // On envoie le token JWT de l'administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On retourne une erreur claire.
    throw new Error(data.message || "Impossible de charger les annonces en réexamen.");
  }

  // On retourne les annonces reçues.
  return data;
}

// Cette fonction permet à l'administrateur de valider une annonce.
export async function validateAnnonceByAdminRequest(annonceId, accessToken) {
  // On envoie une requête PUT vers la route de validation admin.
  const response = await fetch(`${API_URL}/Annonces/admin/${annonceId}/valider`, {
    // On indique que la méthode HTTP est PUT.
    method: "PUT",

    // On prépare les en-têtes de la requête.
    headers: {
      // On indique que le frontend attend du JSON.
      Accept: "application/json",

      // On envoie le token JWT de l'administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On retourne une erreur claire.
    throw new Error(data.message || "Impossible de valider cette annonce.");
  }

  // On retourne l'annonce validée.
  return data;
}

// Cette fonction permet à l'administrateur de rejeter une annonce.
export async function rejectAnnonceByAdminRequest(annonceId, accessToken) {
  // On envoie une requête PUT vers la route de rejet admin.
  const response = await fetch(`${API_URL}/Annonces/admin/${annonceId}/rejeter`, {
    // On indique que la méthode HTTP est PUT.
    method: "PUT",

    // On prépare les en-têtes de la requête.
    headers: {
      // On indique que le frontend attend du JSON.
      Accept: "application/json",

      // On envoie le token JWT de l'administrateur.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si la requête a échoué.
  if (!response.ok) {
    // On retourne une erreur claire.
    throw new Error(data.message || "Impossible de rejeter cette annonce.");
  }

  // On retourne l'annonce rejetée.
  return data;
}

// Cette fonction marque une annonce comme vendue.
export async function markAnnonceAsSoldRequest(annonceId, accessToken) {
  // On envoie une requête PUT au backend.
  const response = await fetch(`${API_URL}/Annonces/${annonceId}/marquer-vendu`, {
    // On utilise PUT pour modifier le statut de l'annonce.
    method: "PUT",

    // On prépare les en-têtes.
    headers: {
      // On accepte une réponse JSON.
      Accept: "application/json",

      // On envoie le token du membre connecté.
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // On lit la réponse sous forme de texte.
  const text = await response.text();

  // On transforme la réponse en JSON si elle existe.
  const data = text ? JSON.parse(text) : {};

  // On vérifie si le backend retourne une erreur.
  if (!response.ok) {
    // On lance une erreur claire.
    throw new Error(data.message || "Impossible de marquer cette annonce comme vendue.");
  }

  // On retourne l'annonce mise à jour.
  return data;
}