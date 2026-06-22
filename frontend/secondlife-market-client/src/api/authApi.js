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

// On crée une fonction pour inscrire un nouvel utilisateur.
export async function registerRequest(userData) {
  // On envoie une requête POST vers la route register.
  const response = await fetch(`${API_URL}/Auth/register`, {
    // On utilise la méthode POST.
    method: "POST",

    // On indique que le contenu envoyé est du JSON.
    headers: {
      // On précise le format JSON.
      "Content-Type": "application/json",
    },

    // On autorise les cookies sécurisés.
    credentials: "include",

    // On transforme les données en JSON.
    body: JSON.stringify(userData),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

  // On vérifie si le backend a refusé la requête.
  if (!response.ok) {
    // On affiche le message du backend.
    throw new Error(data.message || "Inscription impossible.");
  }

  // On retourne les données reçues.
  return data;
}

// On crée une fonction pour connecter l'utilisateur.
export async function loginRequest(credentials) {
  // On envoie une requête POST vers la route login.
  const response = await fetch(`${API_URL}/Auth/login`, {
    // On utilise la méthode POST.
    method: "POST",

    // On indique que le contenu envoyé est du JSON.
    headers: {
      // On précise le format JSON.
      "Content-Type": "application/json",
    },

    // On autorise les cookies sécurisés.
    credentials: "include",

    // On transforme l'email et le mot de passe en JSON.
    body: JSON.stringify(credentials),
  });

  // On lit la réponse du backend.
  const data = await readResponseData(response);

    // On vérifie si le backend bloque à cause du brute force.
  if (response.status === 429) {
    // On crée une erreur JavaScript.
    const error = new Error(data.message || "Trop de tentatives de connexion.");

    // On ajoute le nombre de tentatives restantes.
    error.remainingAttempts = data.remainingAttempts;

    // On lance l'erreur.
    throw error;
  }

  // On vérifie si l'email ou le mot de passe est incorrect.
  if (response.status === 401) {
    // On crée une erreur JavaScript.
    const error = new Error(data.message || "Email ou mot de passe incorrect.");

    // On ajoute le nombre de tentatives restantes.
    error.remainingAttempts = data.remainingAttempts;

    // On lance l'erreur.
    throw error;
  }

  // On vérifie les autres erreurs possibles.
  if (!response.ok) {
    // On crée une erreur JavaScript.
    const error = new Error(data.message || "Connexion impossible.");

    // On lance l'erreur.
    throw error;
  }

  // On retourne les données de connexion.
  return data;
}

// On crée une fonction pour renouveler la session.
export async function refreshRequest() {
  // On appelle la route refresh.
  const response = await fetch(`${API_URL}/Auth/refresh`, {
    // On utilise la méthode POST.
    method: "POST",

    // On autorise l'envoi du cookie sécurisé.
    credentials: "include",
  });

  // On vérifie si la session est expirée.
  if (!response.ok) {
    // On lance une erreur simple.
    throw new Error("Session expirée.");
  }

  // On retourne les nouvelles données.
  return response.json();
}

// On crée une fonction pour déconnecter l'utilisateur.
export async function logoutRequest(accessToken) {
  // On appelle la route logout.
  const response = await fetch(`${API_URL}/Auth/logout`, {
    // On utilise la méthode POST.
    method: "POST",

    // On envoie le token d'accès.
    headers: {
      // On ajoute le token JWT.
      Authorization: `Bearer ${accessToken}`,
    },

    // On autorise l'envoi du cookie sécurisé.
    credentials: "include",
  });

  // On vérifie si la déconnexion échoue.
  if (!response.ok) {
    // On lance une erreur simple.
    throw new Error("Déconnexion impossible.");
  }

  // On retourne la réponse du backend.
  return response.json();
}