// On importe useEffect pour démarrer la connexion SignalR au chargement.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe Link pour naviguer entre les pages.
import { Link } from "react-router-dom";

// On importe useParams pour récupérer l'id de la demande dans l'URL.
import { useParams } from "react-router-dom";

// On importe la fonction qui crée la connexion SignalR.
import { createMessageHubConnection } from "../../api/messageHubApi.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe la fonction qui permet de signaler un utilisateur.
import { createSignalementUtilisateurRequest } from "../../api/signalementApi.js";

// On crée la page de conversation.
export default function ConversationPage() {
  // On récupère l'identifiant de la demande d'achat depuis l'URL.
  const { demandeAchatId } = useParams();

  // On récupère l'utilisateur connecté et son token.
  const { user, accessToken } = useAuth();

  // On stocke la connexion SignalR.
  const [connection, setConnection] = useState(null);

  // On stocke la conversation ouverte.
  const [conversation, setConversation] = useState(null);

  // On stocke le contenu du message à envoyer.
  const [contenu, setContenu] = useState("");

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'état d'envoi du message.
  const [sending, setSending] = useState(false);

  // On stocke les erreurs.
  const [error, setError] = useState("");

  // On stocke l'état de connexion SignalR.
  const [connectionStatus, setConnectionStatus] = useState("Connexion...");

  // On indique si le formulaire de signalement utilisateur est visible.
const [showUserReportForm, setShowUserReportForm] = useState(false);

// On stocke le motif du signalement utilisateur.
const [userReportMotif, setUserReportMotif] = useState("");

// On stocke la description du signalement utilisateur.
const [userReportDescription, setUserReportDescription] = useState("");

// On stocke le message de succès du signalement utilisateur.
const [userReportSuccess, setUserReportSuccess] = useState("");

// On stocke le message d'erreur du signalement utilisateur.
const [userReportError, setUserReportError] = useState("");

// On indique si le signalement utilisateur est en cours d'envoi.
const [userReportLoading, setUserReportLoading] = useState(false);

  // Cette fonction formate une date avec l'heure.
  function formatDateTime(dateValue) {
    // On crée une date JavaScript.
    const date = new Date(dateValue);

    // On vérifie si la date est invalide.
    if (Number.isNaN(date.getTime())) {
      // On retourne un texte simple.
      return "Date inconnue";
    }

    // On retourne une date lisible.
    return date.toLocaleString("fr-FR");
  }

  // Cette fonction ajoute un message sans créer de doublon.
  function addMessageToConversation(newMessage) {
    // On met à jour la conversation.
    setConversation((oldConversation) => {
      // On vérifie si la conversation existe.
      if (!oldConversation) {
        // On retourne l'ancien état si la conversation n'existe pas.
        return oldConversation;
      }

      // On vérifie si le message existe déjà dans la liste.
      const alreadyExists = oldConversation.messages.some(
        // On compare les identifiants des messages.
        (message) => message.id === newMessage.id
      );

      // On vérifie si le message existe déjà.
      if (alreadyExists) {
        // On retourne l'ancienne conversation sans changement.
        return oldConversation;
      }

      // On retourne la conversation avec le nouveau message.
      return {
        // On garde les anciennes informations de la conversation.
        ...oldConversation,

        // On ajoute le message à la fin de la liste.
        messages: [...oldConversation.messages, newMessage],
      };
    });
  }

  // Cette fonction retourne l'identifiant de l'autre membre de la conversation.
function getUtilisateurASignalerId() {
  // On vérifie si la conversation existe.
  if (!conversation) {
    // On retourne 0 si la conversation n'est pas encore chargée.
    return 0;
  }

  // On récupère l'identifiant de l'utilisateur connecté.
  const currentUserId = Number(user?.id);

  // On vérifie si l'utilisateur connecté est l'acheteur.
  if (currentUserId === conversation.acheteurId) {
    // L'acheteur signale le vendeur.
    return conversation.vendeurId;
  }

  // On vérifie si l'utilisateur connecté est le vendeur.
  if (currentUserId === conversation.vendeurId) {
    // Le vendeur signale l'acheteur.
    return conversation.acheteurId;
  }

  // On retourne 0 si l'utilisateur connecté ne correspond pas à la conversation.
  return 0;
}

// Cette fonction retourne le texte du bouton de signalement.
function getUtilisateurASignalerLabel() {
  // On vérifie si la conversation existe.
  if (!conversation) {
    // On retourne un texte simple.
    return "cet utilisateur";
  }

  // On récupère l'identifiant de l'utilisateur connecté.
  const currentUserId = Number(user?.id);

  // On vérifie si l'utilisateur connecté est l'acheteur.
  if (currentUserId === conversation.acheteurId) {
    // L'acheteur peut signaler le vendeur.
    return "le vendeur";
  }

  // On vérifie si l'utilisateur connecté est le vendeur.
  if (currentUserId === conversation.vendeurId) {
    // Le vendeur peut signaler l'acheteur.
    return "l'acheteur";
  }

  // On retourne un texte par défaut.
  return "cet utilisateur";
}

  // Cette fonction envoie un message avec SignalR.
  async function handleSendMessage(event) {
    // On empêche le rechargement de la page.
    event.preventDefault();

    // On vide l'ancien message d'erreur.
    setError("");

    // On vérifie si la connexion SignalR existe.
    if (!connection) {
      // On affiche une erreur claire.
      setError("La connexion à la messagerie n'est pas encore prête.");

      // On arrête la fonction.
      return;
    }

    // On vérifie si la conversation existe.
    if (!conversation) {
      // On affiche une erreur claire.
      setError("Conversation introuvable.");

      // On arrête la fonction.
      return;
    }

    // On vérifie si le message est vide.
    if (!contenu.trim()) {
      // On affiche une erreur claire.
      setError("Le message ne peut pas être vide.");

      // On arrête la fonction.
      return;
    }

    // On active l'état d'envoi.
    setSending(true);

    // On essaie d'envoyer le message.
    try {
      // On appelle la méthode SendMessage du hub SignalR.
      await connection.invoke("SendMessage", conversation.id, contenu);

      // On vide le champ après l'envoi.
      setContenu("");
    } catch (error) {
      // On affiche le message d'erreur.
      setError(error.message);
    } finally {
      // On désactive l'état d'envoi.
      setSending(false);
    }
  }

  // Ce bloc démarre la connexion SignalR.
  useEffect(() => {
    // On vérifie si le token est disponible.
    if (!accessToken) {
      // On ne démarre pas SignalR sans token.
      return;
    }

    // On prépare une variable pour savoir si le composant est encore affiché.
    let isMounted = true;

    // On prépare l'identifiant de la conversation ouverte.
    let openedConversationId = null;

    // On crée la connexion SignalR.
    const newConnection = createMessageHubConnection(accessToken);

    // On écoute les nouveaux messages envoyés par le backend.
    newConnection.on("ReceiveMessage", (message) => {
      // On ajoute le message reçu dans la conversation.
      addMessageToConversation(message);
    });

    // On écoute le moment où SignalR tente de se reconnecter.
    newConnection.onreconnecting(() => {
      // On affiche l'état de reconnexion.
      setConnectionStatus("Reconnexion...");
    });

    // On écoute le moment où SignalR est reconnecté.
    newConnection.onreconnected(async () => {
      // On affiche l'état connecté.
      setConnectionStatus("Connecté");

      // On vérifie si la demande existe.
      if (demandeAchatId) {
        // On rejoint à nouveau la conversation après reconnexion.
        const openedConversation = await newConnection.invoke(
          "JoinConversation",
          Number(demandeAchatId)
        );

        // On garde l'identifiant de la conversation.
        openedConversationId = openedConversation.id;

        // On met à jour la conversation.
        setConversation(openedConversation);
      }
    });

    // On écoute la fermeture de la connexion.
    newConnection.onclose(() => {
      // On affiche l'état déconnecté.
      setConnectionStatus("Déconnecté");
    });

    // Cette fonction démarre SignalR.
    async function startSignalR() {
      // On active le chargement.
      setLoading(true);

      // On vide l'ancien message d'erreur.
      setError("");

      // On essaie de démarrer la connexion.
      try {
        // On démarre la connexion SignalR.
        await newConnection.start();

        // On vérifie si la page est encore affichée.
        if (!isMounted) {
          // On arrête si la page n'est plus affichée.
          return;
        }

        // On affiche l'état connecté.
        setConnectionStatus("Connecté");

        // On ouvre ou crée la conversation liée à la demande.
        const openedConversation = await newConnection.invoke(
          "JoinConversation",
          Number(demandeAchatId)
        );

        // On garde l'identifiant de la conversation ouverte.
        openedConversationId = openedConversation.id;

        // On stocke la conversation.
        setConversation(openedConversation);

        // On stocke la connexion.
        setConnection(newConnection);
      } catch (error) {
        // On affiche l'état erreur.
        setConnectionStatus("Erreur de connexion");

        // On affiche le message d'erreur.
        setError(error.message);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance la connexion SignalR.
    startSignalR();

    // Cette partie est exécutée quand on quitte la page.
    return () => {
      // On indique que le composant n'est plus affiché.
      isMounted = false;

      // On vérifie si une conversation était ouverte.
      if (openedConversationId) {
        // On quitte le groupe SignalR de cette conversation.
        newConnection.invoke("LeaveConversation", openedConversationId).catch(() => {});
      }

      // On arrête la connexion SignalR.
      newConnection.stop().catch(() => {});
    };
  }, [accessToken, demandeAchatId]);

  // Cette fonction est appelée quand le membre envoie un signalement utilisateur.
async function handleCreateSignalementUtilisateur(event) {
  // On empêche le rechargement de la page.
  event.preventDefault();

  // On vide l'ancien message de succès.
  setUserReportSuccess("");

  // On vide l'ancien message d'erreur.
  setUserReportError("");

  // On vérifie si l'utilisateur est connecté.
  if (!user || !accessToken) {
    // On affiche une erreur si l'utilisateur n'est pas connecté.
    setUserReportError("Vous devez vous connecter pour signaler un utilisateur.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si la conversation existe.
  if (!conversation) {
    // On affiche une erreur si la conversation est introuvable.
    setUserReportError("Conversation introuvable.");

    // On arrête la fonction.
    return;
  }

  // On récupère l'identifiant de l'utilisateur à signaler.
  const utilisateurSignaleId = getUtilisateurASignalerId();

  // On vérifie si l'utilisateur à signaler est valide.
  if (!utilisateurSignaleId) {
    // On affiche une erreur claire.
    setUserReportError("Utilisateur à signaler introuvable.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si le motif est vide.
  if (!userReportMotif.trim()) {
    // On affiche une erreur claire.
    setUserReportError("Le motif du signalement est obligatoire.");

    // On arrête la fonction.
    return;
  }

  // On vérifie si la description est vide.
  if (!userReportDescription.trim()) {
    // On affiche une erreur claire.
    setUserReportError("La description du signalement est obligatoire.");

    // On arrête la fonction.
    return;
  }

  // On active le chargement.
  setUserReportLoading(true);

  // On essaie d'envoyer le signalement.
  try {
    // On prépare les données du signalement.
    const signalementData = {
      // On envoie le motif.
      motif: userReportMotif,

      // On envoie la description.
      description: userReportDescription,
    };

    // On appelle l'API React.
    await createSignalementUtilisateurRequest(
      conversation.id,
      utilisateurSignaleId,
      signalementData,
      accessToken
    );

    // On affiche un message de succès.
    setUserReportSuccess("Votre signalement a été envoyé à l’administrateur.");

    // On vide le motif.
    setUserReportMotif("");

    // On vide la description.
    setUserReportDescription("");

    // On ferme le formulaire.
    setShowUserReportForm(false);
  } catch (error) {
    // On affiche le message d'erreur.
    setUserReportError(error.message);
  } finally {
    // On désactive le chargement.
    setUserReportLoading(false);
  }
}

  // On affiche la page.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="conversation-page">
        {/* On affiche l'en-tête de la conversation. */}
        <section className="conversation-header">
          {/* On affiche le titre principal. */}
          <h1>Conversation</h1>

          {/* On affiche une courte description. */}
          <p>Échangez instantanément avec l’autre membre au sujet de cette demande d’achat.</p>

          {/* On affiche l'état de la connexion SignalR. */}
          <span className="connection-status">{connectionStatus}</span>

          {/* On affiche un lien de retour simple. */}
          <Link className="btn btn-secondary" to="/membre">
            Retour à mon espace
          </Link>
        </section>

        {/* On affiche le message de chargement. */}
        {loading && (
          <p className="page-message">
            Chargement de la conversation...
          </p>
        )}

        {/* On affiche le message d'erreur. */}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {/* On affiche la conversation si elle est chargée. */}
        {!loading && conversation && (
          <section className="conversation-box">
            {/* On affiche les informations de la conversation. */}
            <div className="conversation-info">
              {/* On affiche le titre de l'annonce. */}
              <h2>{conversation.annonceTitre}</h2>

              {/* On affiche le nom de l'acheteur. */}
              <p>Acheteur : {conversation.acheteurNomComplet || "Acheteur inconnu"}</p>

              {/* On affiche le nom du vendeur. */}
              <p>Vendeur : {conversation.vendeurNomComplet || "Vendeur inconnu"}</p>

              {/* On affiche le lien vers l'annonce. */}
              <Link className="request-link" to={`/annonces/${conversation.annonceId}`}>
                Voir l'annonce
              </Link>

            {/* Bloc de signalement utilisateur. */}
            <div className="report-user-box">
            {/* Bouton pour afficher ou cacher le formulaire. */}
            <button
                // Le bouton ne soumet pas de formulaire.
                type="button"

                // Classe CSS du bouton.
                className="btn btn-secondary"

                // Au clic, on affiche ou cache le formulaire.
                onClick={() => setShowUserReportForm(!showUserReportForm)}
            >
                {/* Texte du bouton selon l'utilisateur connecté. */}
                {showUserReportForm
                ? "Fermer le signalement"
                : `Signaler ${getUtilisateurASignalerLabel()}`}
            </button>

            {/* Message de succès. */}
            {userReportSuccess && (
                <p className="form-success" role="status">
                {userReportSuccess}
                </p>
            )}

            {/* Message d'erreur. */}
            {userReportError && (
                <p className="form-error" role="alert">
                {userReportError}
                </p>
            )}

            {/* Formulaire de signalement utilisateur. */}
        {showUserReportForm && (
            <form className="report-form" onSubmit={handleCreateSignalementUtilisateur}>
            {/* Champ motif. */}
            <label htmlFor="userReportMotif">Motif du signalement</label>

            {/* Liste des motifs. */}
            <select
                // Identifiant lié au label.
                id="userReportMotif"

                // Nom du champ.
                name="userReportMotif"

                // Valeur actuelle.
                value={userReportMotif}

                // Mise à jour du motif.
                onChange={(event) => setUserReportMotif(event.target.value)}

                // Champ obligatoire.
                required

                // Accessibilité.
                aria-required="true"

                // Classe CSS.
                className="form-select"
            >
                {/* Option vide. */}
                <option value="">Choisir un motif</option>

                {/* Motif 1. */}
                <option value="Comportement inapproprié">Comportement inapproprié</option>

                {/* Motif 2. */}
                <option value="Harcèlement">Harcèlement</option>

                {/* Motif 3. */}
                <option value="Insultes ou menaces">Insultes ou menaces</option>

                {/* Motif 4. */}
                <option value="Tentative d'arnaque">Tentative d'arnaque</option>

                {/* Motif 5. */}
                <option value="Autre">Autre</option>
            </select>

            {/* Champ description. */}
            <label htmlFor="userReportDescription">Description</label>

            {/* Zone de texte pour expliquer le problème. */}
            <textarea
                // Identifiant lié au label.
                id="userReportDescription"

                // Nom du champ.
                name="userReportDescription"

                // Valeur actuelle.
                value={userReportDescription}

                // Mise à jour de la description.
                onChange={(event) => setUserReportDescription(event.target.value)}

                // Texte d'aide.
                placeholder="Expliquez clairement le comportement problématique."

                // Limite backend.
                maxLength={1000}

                // Champ obligatoire.
                required

                // Accessibilité.
                aria-required="true"

                // Classe CSS existante.
                className="form-textarea"
            />

            {/* Bouton d'envoi. */}
            <button
                // Le bouton soumet le formulaire.
                type="submit"

                // Classe CSS du bouton.
                className="btn btn-danger"

                // On désactive pendant l'envoi.
                disabled={userReportLoading}
            >
                {/* Texte selon l'état. */}
                {userReportLoading ? "Envoi..." : "Envoyer le signalement"}
            </button>
            </form>
        )}
        </div>
            </div>

            {/* On affiche la liste des messages. */}
            <div className="messages-list">
              {/* On affiche un message si la conversation est vide. */}
              {conversation.messages.length === 0 && (
                <p className="empty-message">
                  Aucun message pour le moment. Envoyez le premier message.
                </p>
              )}

              {/* On parcourt les messages. */}
              {conversation.messages.map((message) => {
                // On vérifie si le message appartient à l'utilisateur connecté.
                const isMine = message.expediteurId === user?.id;

                // On retourne le message.
                return (
                  <article
                    // On utilise l'id comme clé unique.
                    key={message.id}

                    // On change le style selon l'expéditeur.
                    className={isMine ? "message-item message-mine" : "message-item message-other"}
                  >
                    {/* On affiche le nom de l'expéditeur. */}
                    <strong>{message.expediteurNomComplet || "Utilisateur"}</strong>

                    {/* On affiche le contenu du message. */}
                    <p>{message.contenu}</p>

                    {/* On affiche la date du message. */}
                    <span>{formatDateTime(message.dateEnvoi)}</span>
                  </article>
                );
              })}
            </div>

            {/* On affiche le formulaire d'envoi. */}
            <form className="message-form" onSubmit={handleSendMessage}>
              {/* On affiche le label du champ. */}
              <label htmlFor="contenu">Votre message</label>

              {/* On affiche la zone de texte. */}
              <textarea
                // On lie le label au champ.
                id="contenu"

                // On donne un nom au champ.
                name="contenu"

                // On lie la valeur au state.
                value={contenu}

                // On met à jour le state quand l'utilisateur écrit.
                onChange={(event) => setContenu(event.target.value)}

                // On affiche un texte d'aide.
                placeholder="Écrivez votre message ici..."

                // On limite le message à 2000 caractères.
                maxLength={2000}

                // On rend le champ obligatoire.
                required

                // On applique le style existant.
                className="form-textarea"
              />

              {/* On affiche le bouton d'envoi. */}
              <button
                // On donne le style principal au bouton.
                className="btn btn-primary"

                // On indique que le bouton soumet le formulaire.
                type="submit"

                // On désactive le bouton pendant l'envoi.
                disabled={sending || connectionStatus !== "Connecté"}
              >
                {/* On change le texte selon l'état. */}
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </section>
        )}
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}