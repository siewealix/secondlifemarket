// On importe useEffect pour faire une vérification automatique.
import { useEffect } from "react";

// On importe useNavigate pour rediriger l'utilisateur.
import { useNavigate } from "react-router-dom";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe l'utilitaire de détection de suspension.
import { isSuspendedAccountMessage } from "../../utils/authErrorUtils.js";

// On crée le composant qui surveille les comptes suspendus.
export default function SuspendedAccountWatcher() {
  // On récupère les données d'authentification.
  const { accessToken, logout } = useAuth();

  // On prépare la navigation.
  const navigate = useNavigate();

  // Ce bloc s'exécute quand le token change.
  useEffect(() => {
    // On arrête si aucun token n'existe.
    if (!accessToken) {
      return;
    }

    // On prépare une variable pour éviter les mises à jour inutiles.
    let isMounted = true;

    // On crée la fonction de vérification.
    async function checkAccountStatus() {
      // On essaie de vérifier l'utilisateur connecté.
      try {
        // On récupère l'adresse de l'API.
        const API_URL = import.meta.env.VITE_API_URL;

        // On appelle la route Auth/me.
        const response = await fetch(`${API_URL}/Auth/me`, {
          // On utilise GET.
          method: "GET",

          // On prépare les en-têtes.
          headers: {
            // On accepte JSON.
            Accept: "application/json",

            // On envoie le token.
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // On lit la réponse sous forme de texte.
        const text = await response.text();

        // On transforme la réponse en JSON si elle existe.
        const data = text ? JSON.parse(text) : {};

        // On vérifie si le backend a bloqué le compte.
        if (response.status === 403 && isSuspendedAccountMessage(data.message)) {
          // On arrête si le composant n'est plus monté.
          if (!isMounted) {
            return;
          }

          // On déconnecte l'utilisateur côté frontend.
          await logout();

          // On redirige vers la connexion avec un message.
          navigate("/login", {
            replace: true,
            state: {
              message: data.message,
            },
          });
        }
      } catch {
        // On ne bloque pas l'application si la vérification échoue.
      }
    }

    // On lance la vérification.
    checkAccountStatus();

    // On nettoie quand le composant est démonté.
    return () => {
      // On marque le composant comme démonté.
      isMounted = false;
    };
  }, [accessToken, logout, navigate]);

  // Ce composant n'affiche rien.
  return null;
}