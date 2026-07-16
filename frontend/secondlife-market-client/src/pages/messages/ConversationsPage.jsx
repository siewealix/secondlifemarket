import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { getConversationsRequest } from "../../api/conversationApi.js";
import useAuth from "../../hooks/useAuth.js";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";

export default function ConversationsPage() {
  const { user, accessToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let active = true;

    async function loadConversations() {
      try {
        setLoading(true);
        setError("");
        const data = await getConversationsRequest(accessToken);

        if (active) {
          setConversations(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      active = false;
    };
  }, [accessToken]);

  function formatDate(dateValue) {
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime())
      ? "Date inconnue"
      : date.toLocaleString("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  }

  function getOtherUser(conversation) {
    return Number(user?.id) === conversation.acheteurId
      ? conversation.vendeurNomComplet
      : conversation.acheteurNomComplet;
  }

  function getLastMessage(conversation) {
    return conversation.messages?.at(-1) ?? null;
  }

  return (
    <>
      <Navbar />

      <main className="conversations-page">
        <section className="conversations-header">
          <div>
            <span className="conversations-eyebrow">Votre espace privé</span>
            <h1>Messagerie</h1>
            <p>Retrouvez toutes vos conversations avec les acheteurs et les vendeurs.</p>
          </div>
          <MessageCircle size={52} aria-hidden="true" />
        </section>

        {loading && <p className="page-message">Chargement de vos conversations...</p>}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && conversations.length === 0 && (
          <section className="empty-box">
            <MessageCircle size={44} aria-hidden="true" />
            <h2>Aucune conversation</h2>
            <p>Une conversation apparaîtra ici lorsqu’une demande d’achat acceptée sera ouverte.</p>
            <Link className="btn btn-primary" to="/annonces">
              Voir les annonces
            </Link>
          </section>
        )}

        {!loading && !error && conversations.length > 0 && (
          <section className="conversations-list" aria-label="Liste des conversations">
            {conversations.map((conversation) => {
              const lastMessage = getLastMessage(conversation);
              const lastActivity = lastMessage?.dateEnvoi ?? conversation.dateCreation;

              return (
                <Link
                  key={conversation.id}
                  className="conversation-card"
                  to={`/messages/demande/${conversation.demandeAchatId}`}
                >
                  <div className="conversation-avatar" aria-hidden="true">
                    <MessageCircle size={26} />
                  </div>

                  <div className="conversation-card-content">
                    <div className="conversation-card-topline">
                      <h2>{getOtherUser(conversation) || "Utilisateur"}</h2>
                      <time dateTime={lastActivity}>{formatDate(lastActivity)}</time>
                    </div>

                    <strong>{conversation.annonceTitre || "Annonce"}</strong>
                    <p>
                      {lastMessage
                        ? `${lastMessage.expediteurId === user?.id ? "Vous : " : ""}${lastMessage.contenu}`
                        : "Aucun message. Ouvrez la conversation pour commencer à échanger."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
