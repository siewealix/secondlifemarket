// On importe useEffect pour exécuter du code au chargement de la page.
import { useEffect } from "react";

// On importe useState pour stocker les données de la page.
import { useState } from "react";

// On importe Link pour créer des liens entre les pages.
import { Link } from "react-router-dom";

// On importe la fonction qui récupère les conversations depuis le backend.
import { getMyConversationsRequest } from "../../api/conversationApi.js";

// On importe le hook qui permet d'accéder à l'utilisateur connecté.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation du site.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page du site.
import Footer from "../../components/layout/Footer.jsx";

// On crée la page qui affiche toutes les conversations.
export default function ConversationsPage() {
  // On récupère l'utilisateur connecté et son token.
  const { user, accessToken } = useAuth();

  // On stocke la liste des conversations.
  const [conversations, setConversations] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke un éventuel message d'erreur.
  const [error, setError] = useState("");

  // Cette fonction récupère les conversations depuis le backend.
  async function loadConversations() {
    // On active le chargement.
    setLoading(true);

    // On efface l'ancien message d'erreur.
    setError("");

    // On essaie de récupérer les conversations.
    try {
      // On appelle la fonction située dans conversationApi.js.
      const data = await getMyConversationsRequest(accessToken);

      // On vérifie que le backend retourne bien une liste.
      if (Array.isArray(data)) {
        // On stocke les conversations reçues.
        setConversations(data);
      } else {
        // On utilise une liste vide si la réponse est incorrecte.
        setConversations([]);
      }
    } catch (requestError) {
      // On affiche le message de l'erreur.
      setError(requestError.message);

      // On vide la liste des conversations.
      setConversations([]);
    } finally {
      // On arrête le chargement.
      setLoading(false);
    }
  }

  // Cette fonction retourne le nom de l'autre membre.
  function getOtherUserName(conversation) {
    // On transforme l'identifiant de l'utilisateur connecté en nombre.
    const currentUserId = Number(user?.id);

    // On vérifie si l'utilisateur connecté est l'acheteur.
    if (currentUserId === conversation.acheteurId) {
      // On retourne le nom du vendeur.
      return conversation.vendeurNomComplet || "Vendeur inconnu";
    }

    // On vérifie si l'utilisateur connecté est le vendeur.
    if (currentUserId === conversation.vendeurId) {
      // On retourne le nom de l'acheteur.
      return conversation.acheteurNomComplet || "Acheteur inconnu";
    }

    // On retourne un texte par défaut.
    return "Utilisateur inconnu";
  }

  // Cette fonction retourne le dernier message d'une conversation.
  function getLastMessage(conversation) {
    // On vérifie si la conversation ne contient aucun message.
    if (!conversation.messages || conversation.messages.length === 0) {
      // On retourne un message par défaut.
      return "Aucun message pour le moment.";
    }

    // On récupère le dernier message de la liste.
    const lastMessage =
      conversation.messages[conversation.messages.length - 1];

    // On retourne le contenu du dernier message.
    return lastMessage.contenu;
  }

  // Cette fonction retourne la date de la dernière activité.
  function getLastActivityDate(conversation) {
    // On vérifie si la conversation contient des messages.
    if (conversation.messages && conversation.messages.length > 0) {
      // On récupère le dernier message.
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];

      // On retourne la date du dernier message.
      return lastMessage.dateEnvoi;
    }

    // On retourne la date de création de la conversation.
    return conversation.dateCreation;
  }

  // Cette fonction transforme une date en texte lisible.
  function formatDate(dateValue) {
    // On crée une date JavaScript.
    const date = new Date(dateValue);

    // On vérifie si la date est invalide.
    if (Number.isNaN(date.getTime())) {
      // On retourne un texte simple.
      return "Date inconnue";
    }

    // On retourne la date et l'heure en français.
    return date.toLocaleString("fr-FR");
  }

  // Ce bloc est exécuté au chargement de la page.
  useEffect(() => {
    // On vérifie que le token existe.
    if (accessToken) {
      // On charge les conversations.
      loadConversations();
    }
  }, [accessToken]);

  // On retourne le contenu visible de la page.
  return (
    // Le fragment permet de regrouper plusieurs éléments.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On crée le contenu principal de la page. */}
      <main className="conversations-page">
        {/* On crée l'en-tête de la page. */}
        <section className="conversations-header">
          {/* On affiche le titre principal. */}
          <h1>Ma messagerie</h1>

          {/* On affiche une courte description. */}
          <p>
            Retrouvez ici toutes vos conversations.
          </p>
        </section>

        {/* On affiche un message pendant le chargement. */}
        {loading && (
          <p className="page-message">
            Chargement de vos conversations...
          </p>
        )}

        {/* On affiche le message d'erreur si une erreur existe. */}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {/* On affiche un message si aucune conversation n'existe. */}
        {!loading && !error && conversations.length === 0 && (
          <section className="empty-box">
            {/* On affiche le titre du bloc vide. */}
            <h2>Aucune conversation</h2>

            {/* On affiche une explication. */}
            <p>
              Vous n'avez encore aucune conversation.
            </p>

            {/* On crée un lien vers les annonces. */}
            <Link to="/annonces" className="btn btn-primary">
              Voir les annonces
            </Link>
          </section>
        )}

        {/* On affiche la liste si des conversations existent. */}
        {!loading && !error && conversations.length > 0 && (
          <section className="conversations-list">
            {/* On parcourt toutes les conversations. */}
            {conversations.map((conversation) => (
              // On crée une carte pour chaque conversation.
              <article
                // On applique une classe CSS à la carte.
                className="conversation-card"

                // On utilise l'identifiant comme clé unique.
                key={conversation.id}
              >
                {/* On crée la partie contenant les informations. */}
                <div className="conversation-card-content">
                  {/* On affiche le nom de l'autre membre. */}
                  <h2>
                    {getOtherUserName(conversation)}
                  </h2>

                  {/* On affiche le titre de l'annonce. */}
                  <p className="conversation-annonce">
                    Annonce : {conversation.annonceTitre}
                  </p>

                  {/* On affiche le dernier message. */}
                  <p className="conversation-last-message">
                    {getLastMessage(conversation)}
                  </p>

                  {/* On affiche la date de la dernière activité. */}
                  <span className="conversation-date">
                    {formatDate(getLastActivityDate(conversation))}
                  </span>
                </div>

                {/* On crée le lien qui ouvre la conversation. */}
                <Link
                  // On utilise l'identifiant de la demande d'achat.
                  to={`/messages/demande/${conversation.demandeAchatId}`}

                  // On applique le style d'un bouton.
                  className="btn btn-primary"
                >
                  {/* Texte du bouton. */}
                  Ouvrir
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* On affiche le pied de page. */}
      <Footer />
    </>
  );
}