// On importe useEffect pour charger les données au démarrage de la page.
import { useEffect } from "react";

// On importe useState pour stocker les données et les messages.
import { useState } from "react";

// On importe Link pour créer des liens internes.
import { Link } from "react-router-dom";

// On importe les fonctions liées aux demandes d'achat.
import {
  // On importe la fonction qui récupère les demandes reçues.
  getDemandesRecuesRequest,

  // On importe la fonction qui accepte une demande.
  acceptDemandeAchatRequest,

  // On importe la fonction qui refuse une demande.
  refuseDemandeAchatRequest,
} from "../../api/demandeApi.js";

// On importe la fonction qui construit l'URL complète d'une photo.
import { getPhotoUrl } from "../../api/annonceApi.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";


// Page qui affiche les demandes d'achat reçues par le vendeur.
export default function ReceivedPurchaseRequestsPage() {
  // On récupère le token du vendeur connecté.
  const { accessToken } = useAuth();

  // On stocke la liste des demandes reçues.
  const [demandes, setDemandes] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke le message de succès.
    const [success, setSuccess] = useState("");

    // On stocke l'action en cours sur une demande.
    const [processingAction, setProcessingAction] = useState("");

  // Cette fonction formate le prix en FCFA.
  function formatPrice(price) {
    // On transforme le prix en nombre.
    const value = Number(price);

    // On vérifie si le prix est invalide.
    if (Number.isNaN(value)) {
      // On retourne un prix simple par défaut.
      return "0 FCFA";
    }

    // On retourne le prix formaté en français.
    return `${value.toLocaleString("fr-FR")} FCFA`;
  }

  // Cette fonction formate la date.
  function formatDate(dateValue) {
    // On crée une date JavaScript.
    const date = new Date(dateValue);

    // On vérifie si la date est invalide.
    if (Number.isNaN(date.getTime())) {
      // On retourne un texte simple.
      return "Date inconnue";
    }

    // On retourne une date lisible.
    return date.toLocaleDateString("fr-FR");
  }

  // Cette fonction retourne une classe CSS selon le statut.
  function getStatusClass(statut) {
    // On vérifie si la demande est en attente.
    if (statut === "En attente") {
      // On retourne la classe du statut en attente.
      return "request-status request-status-pending";
    }

    // On vérifie si la demande est acceptée.
    if (statut === "Acceptée") {
      // On retourne la classe du statut accepté.
      return "request-status request-status-accepted";
    }

    // On vérifie si la demande est refusée.
    if (statut === "Refusée") {
      // On retourne la classe du statut refusé.
      return "request-status request-status-refused";
    }

    // On vérifie si la demande est annulée.
    if (statut === "Annulée") {
      // On retourne la classe du statut annulé.
      return "request-status request-status-cancelled";
    }

    // On retourne une classe par défaut.
    return "request-status";
  }

  // Cette fonction charge les demandes reçues.
  async function loadDemandesRecues() {
    // On vide l'ancien message d'erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les demandes reçues.
    try {
      // On appelle l'API React.
      const data = await getDemandesRecuesRequest(accessToken);

      // On stocke les demandes reçues.
      setDemandes(data);
    } catch (error) {
      // On affiche le message d'erreur.
      setError(error.message);
    } finally {
      // On arrête le chargement.
      setLoading(false);
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge les demandes reçues.
      loadDemandesRecues();
    }
  }, [accessToken]);

  // Cette fonction met à jour une demande dans la liste affichée.
function updateDemandeInList(updatedDemande) {
  // On met à jour la liste des demandes.
  setDemandes((oldDemandes) =>
    // On parcourt les anciennes demandes.
    oldDemandes.map((demande) =>
      // On vérifie si la demande actuelle est celle qui a été modifiée.
      demande.id === updatedDemande.id
        // On remplace l'ancienne demande par la demande mise à jour.
        ? updatedDemande
        // On garde les autres demandes sans changement.
        : demande
    )
  );
}

// Cette fonction accepte une demande d'achat.
async function handleAcceptDemande(demandeId) {
  // On vide l'ancien message d'erreur.
  setError("");

  // On vide l'ancien message de succès.
  setSuccess("");

  // On demande une confirmation au vendeur.
  const confirmed = window.confirm("Voulez-vous vraiment accepter cette demande d'achat ?");

  // On vérifie si le vendeur a annulé la confirmation.
  if (!confirmed) {
    // On arrête la fonction.
    return;
  }

  // On indique que cette demande est en cours d'acceptation.
  setProcessingAction(`accept-${demandeId}`);

  // On essaie d'accepter la demande.
  try {
    // On appelle l'API React qui appelle le backend.
    const updatedDemande = await acceptDemandeAchatRequest(demandeId, accessToken);

    // On met à jour la demande dans la liste.
    updateDemandeInList(updatedDemande);

    // On affiche un message de succès.
    setSuccess("La demande d'achat a été acceptée.");
  } catch (error) {
    // On affiche le message d'erreur.
    setError(error.message);
  } finally {
    // On arrête le chargement de l'action.
    setProcessingAction("");
  }
}

// Cette fonction refuse une demande d'achat.
async function handleRefuseDemande(demandeId) {
  // On vide l'ancien message d'erreur.
  setError("");

  // On vide l'ancien message de succès.
  setSuccess("");

  // On demande une confirmation au vendeur.
  const confirmed = window.confirm("Voulez-vous vraiment refuser cette demande d'achat ?");

  // On vérifie si le vendeur a annulé la confirmation.
  if (!confirmed) {
    // On arrête la fonction.
    return;
  }

  // On indique que cette demande est en cours de refus.
  setProcessingAction(`refuse-${demandeId}`);

  // On essaie de refuser la demande.
  try {
    // On appelle l'API React qui appelle le backend.
    const updatedDemande = await refuseDemandeAchatRequest(demandeId, accessToken);

    // On met à jour la demande dans la liste.
    updateDemandeInList(updatedDemande);

    // On affiche un message de succès.
    setSuccess("La demande d'achat a été refusée.");
  } catch (error) {
    // On affiche le message d'erreur.
    setError(error.message);
  } finally {
    // On arrête le chargement de l'action.
    setProcessingAction("");
  }
}

  // On affiche la page.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* Contenu principal de la page. */}
      <main className="seller-requests-page">
        {/* En-tête de la page. */}
        <section className="seller-requests-header">
          {/* Titre principal. */}
          <h1>Demandes reçues</h1>

          {/* Description de la page. */}
          <p>Retrouvez ici les demandes envoyées par les acheteurs sur vos annonces.</p>

          {/* Lien pour retourner à l'espace vendeur. */}
          <Link className="btn btn-secondary" to="/membre/vendeur">
            Retour à l'espace vendeur
          </Link>
        </section>

        {/* Message pendant le chargement. */}
        {loading && (
          <p className="page-message">
            Chargement des demandes reçues...
          </p>
        )}

        {/* Message d'erreur. */}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {/* Message de succès. */}
        {success && (
        <p className="form-success" role="status">
            {success}
        </p>
        )}

        {/* Message quand aucune demande n'existe. */}
        {!loading && !error && demandes.length === 0 && (
          <section className="empty-box">
            {/* Titre du message vide. */}
            <h2>Aucune demande reçue</h2>

            {/* Explication du message vide. */}
            <p>Vous n'avez pas encore reçu de demande d'achat sur vos annonces.</p>

            {/* Lien vers les annonces du vendeur. */}
            <Link className="btn btn-primary" to="/membre/vendeur/mes-annonces">
              Voir mes annonces
            </Link>
          </section>
        )}

        {/* Liste des demandes reçues. */}
        {!loading && !error && demandes.length > 0 && (
          <section className="requests-list">
            {/* On parcourt les demandes une par une. */}
            {demandes.map((demande) => (
              // Carte d'une demande reçue.
              <article className="request-card" key={demande.id}>
                {/* Zone de l'image de l'annonce. */}
                <div className="request-card-image">
                  {/* On affiche l'image si elle existe. */}
                  {demande.annoncePhotoUrl ? (
                    <img
                      // URL complète de la photo.
                      src={getPhotoUrl(demande.annoncePhotoUrl)}

                      // Texte alternatif de l'image.
                      alt={demande.annonceTitre}
                    />
                  ) : (
                    // Placeholder si aucune photo n'est disponible.
                    <span>📦</span>
                  )}
                </div>

                {/* Contenu textuel de la carte. */}
                <div className="request-card-content">
                  {/* Titre de l'annonce. */}
                  <h2>{demande.annonceTitre}</h2>

                  {/* Prix de l'annonce. */}
                  <p className="request-price">
                    {formatPrice(demande.annoncePrix)}
                  </p>

                  {/* Nom de l'acheteur. */}
                  <p>
                    Acheteur : {demande.acheteurNomComplet || "Acheteur inconnu"}
                  </p>

                  {/* Date de la demande. */}
                  <p>
                    Demande reçue le : {formatDate(demande.dateDemande)}
                  </p>

                  {/* Message envoyé par l'acheteur. */}
                  {demande.message && (
                    <p className="request-message">
                      Message : {demande.message}
                    </p>
                  )}

                  {/* Statut de la demande. */}
                  <span className={getStatusClass(demande.statut)}>
                    {demande.statut}
                  </span>

                  {/* Zone des actions de la demande. */}
                    <div className="request-actions">
                    {/* Lien vers l'annonce. */}
                    <Link className="request-link" to={`/annonces/${demande.annonceId}`}>
                        Voir l'annonce
                    </Link>

                    {/* On affiche le lien de conversation seulement si la demande peut encore être discutée. */}
                    {(demande.statut === "En attente" || demande.statut === "Acceptée") && (
                    <Link className="btn btn-secondary" to={`/messages/demande/${demande.id}`}>
                        Échanger avec l'acheteur
                    </Link>
                    )}

                    {/* On affiche les boutons seulement si la demande est en attente. */}
                    {demande.statut === "En attente" && (
                        <>
                        {/* Bouton pour accepter la demande. */}
                        <button
                            // Le bouton ne soumet pas de formulaire.
                            type="button"

                            // Classe CSS du bouton accepter.
                            className="btn btn-success"

                            // Fonction appelée au clic.
                            onClick={() => handleAcceptDemande(demande.id)}

                            // On désactive le bouton pendant l'action.
                            disabled={processingAction !== ""}
                        >
                            {/* Texte du bouton selon l'état. */}
                            {processingAction === `accept-${demande.id}` ? "Acceptation..." : "Accepter"}
                        </button>

                        {/* Bouton pour refuser la demande. */}
                        <button
                            // Le bouton ne soumet pas de formulaire.
                            type="button"

                            // Classe CSS du bouton refuser.
                            className="btn btn-danger"

                            // Fonction appelée au clic.
                            onClick={() => handleRefuseDemande(demande.id)}

                            // On désactive le bouton pendant l'action.
                            disabled={processingAction !== ""}
                        >
                            {/* Texte du bouton selon l'état. */}
                            {processingAction === `refuse-${demande.id}` ? "Refus..." : "Refuser"}
                        </button>
                        </>
                    )}
                    </div>
                </div>
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