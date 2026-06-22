// On importe createContext pour créer un contexte global.
import { createContext } from "react";

// On importe useEffect pour vérifier la session au chargement.
import { useEffect } from "react";

// On importe useState pour stocker l'utilisateur connecté.
import { useState } from "react";

// On importe les fonctions API d'authentification.
import { loginRequest, logoutRequest, refreshRequest, registerRequest } from "../api/authApi.js";

// On crée le contexte d'authentification.
export const AuthContext = createContext(null);

// On crée le nom de la clé utilisée dans localStorage.
const SESSION_KEY = "slm_has_session";

// On crée le fournisseur d'authentification.
export function AuthProvider({ children }) {
  // On stocke l'utilisateur connecté.
  const [user, setUser] = useState(null);

  // On stocke le token d'accès.
  const [accessToken, setAccessToken] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On vérifie la session au chargement de l'application.
  useEffect(() => {
    // On crée une fonction interne pour charger la session.
    async function loadSession() {
      // On vérifie si le frontend sait qu'une session existait.
      const hasSession = localStorage.getItem(SESSION_KEY);

      // On évite d'appeler refresh si aucune session n'existe.
      if (!hasSession) {
        // On vide l'utilisateur.
        setUser(null);

        // On vide le token.
        setAccessToken(null);

        // On arrête le chargement.
        setLoading(false);

        // On arrête la fonction.
        return;
      }

      // On essaie de renouveler la session.
      try {
        // On appelle le backend avec le cookie sécurisé.
        const data = await refreshRequest();

        // On stocke le nouveau token d'accès.
        setAccessToken(data.accessToken);

        // On stocke l'utilisateur connecté.
        setUser(data.user);
      } catch {
        // On supprime l'indicateur de session si le refresh échoue.
        localStorage.removeItem(SESSION_KEY);

        // On vide l'utilisateur.
        setUser(null);

        // On vide le token.
        setAccessToken(null);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance la vérification de session.
    loadSession();
  }, []);

  // On crée la fonction d'inscription réelle.
  async function register(userData) {
    // On appelle le backend pour inscrire l'utilisateur.
    const data = await registerRequest(userData);

    // On stocke l'indicateur de session.
    localStorage.setItem(SESSION_KEY, "true");

    // On stocke le token reçu.
    setAccessToken(data.accessToken);

    // On stocke l'utilisateur reçu.
    setUser(data.user);

    // On retourne l'utilisateur.
    return data.user;
  }

  // On crée la fonction de connexion réelle.
  async function login(credentials) {
    // On appelle le backend pour connecter l'utilisateur.
    const data = await loginRequest(credentials);

    // On stocke l'indicateur de session.
    localStorage.setItem(SESSION_KEY, "true");

    // On stocke le token reçu.
    setAccessToken(data.accessToken);

    // On stocke l'utilisateur reçu.
    setUser(data.user);

    // On retourne l'utilisateur.
    return data.user;
  }

  // On crée la fonction de déconnexion réelle.
  async function logout() {
    // On essaie de prévenir le backend.
    try {
      // On appelle le backend pour supprimer le cookie sécurisé.
      await logoutRequest(accessToken);
    } finally {
      // On supprime l'indicateur de session.
      localStorage.removeItem(SESSION_KEY);

      // On vide le token.
      setAccessToken(null);

      // On vide l'utilisateur.
      setUser(null);
    }
  }

  // On prépare les données partagées.
  const value = {
    // On expose l'utilisateur.
    user,

    // On expose le token.
    accessToken,

    // On expose l'état connecté.
    isAuthenticated: Boolean(user && accessToken),

    // On expose le chargement.
    loading,

    // On expose l'inscription.
    register,

    // On expose la connexion.
    login,

    // On expose la déconnexion.
    logout,
  };

  // On retourne le contexte.
  return (
    // On fournit les données à toute l'application.
    <AuthContext.Provider value={value}>
      {/* On affiche les composants enfants. */}
      {children}
    </AuthContext.Provider>
  );
}