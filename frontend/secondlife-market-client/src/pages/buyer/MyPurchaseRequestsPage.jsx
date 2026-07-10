// On importe useEffect pour charger les données au démarrage de la page.
import { useEffect } from "react";

// On importe useState pour stocker les données et les messages.
import { useState } from "react";

// On importe Link pour créer des liens internes.
import { Link } from "react-router-dom";

// On importe les fonctions liées aux demandes d'achat.
import {
  // On importe la fonction qui récupère les demandes envoyées.
  getMyDemandesAchatRequest,

  // On importe la fonction qui annule une demande.
  cancelDemandeAchatRequest,
} from "../../api/demandeApi.js";

// On importe la fonction qui construit l'URL complète d'une photo.
import { getPhotoUrl } from "../../api/annonceApi.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// Page qui affiche les demandes d'achat envoyées par l'acheteur.
export default function MyPurchaseRequestsPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke la liste des demandes d'achat.
  const [demandes, setDemandes] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke l'identifiant de la demande en cours d'annulation.
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

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

  // Cette fonction formate la date de demande.
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

  // Cette fonction charge les demandes d'achat.
  async function loadDemandes() {
    // On vide l'ancien message d'erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les demandes.
    try {
      // On appelle l'API React.
      const data = await getMyDemandesAchatRequest(accessToken);

      // On stocke la liste reçue.
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
      // On charge les demandes d'achat.
      loadDemandes();
    }
  }, [accessToken]);

  // Cette fonction annule une demande d'achat.
async function handleCancelDemande(demandeId) {
  // On vide l'ancien message d'erreur.
  setError("");

  // On demande une confirmation simple à l'acheteur.
  const confirmed = window.confirm("Voulez-vous vraiment annuler cette demande d'achat ?");

  // On vérifie si l'acheteur a refusé la confirmation.
  if (!confirmed) {
    // On arrête la fonction.
    return;
  }

  // On indique quelle demande est en cours d'annulation.
  setCancelLoadingId(demandeId);

  // On essaie d'annuler la demande.
  try {
    // On appelle l'API React qui appelle le backend.
    const updatedDemande = await cancelDemandeAchatRequest(demandeId, accessToken);

    // On met à jour la demande dans la liste affichée.
    setDemandes((oldDemandes) =>
      // On parcourt les anciennes demandes.
      oldDemandes.map((demande) =>
        // On vérifie si c'est la demande annulée.
        demande.id === updatedDemande.id
          // On remplace l'ancienne demande par la demande mise à jour.
          ? updatedDemande
          // On garde les autres demandes sans changement.
          : demande
      )
    );
  } catch (error) {
    // On affiche le message d'erreur.
    setError(error.message);
  } finally {
    // On arrête le chargement d'annulation.
    setCancelLoadingId(null);
  }
}

  // On affiche la page.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* Contenu principal de la page. */}
      <main className="buyer-requests-page">
        {/* En-tête de la page. */}
        <section className="buyer-requests-header">
          {/* Titre principal. */}
          <h1>Mes demandes d'achat</h1>

          {/* Description simple. */}
          <p>Retrouvez ici toutes les demandes que vous avez envoyées aux vendeurs.</p>

          {/* Lien pour retourner à l'espace acheteur. */}
          <Link className="btn btn-secondary" to="/membre/acheteur">
            Retour à l'espace acheteur
          </Link>
        </section>

        {/* Message pendant le chargement. */}
        {loading && (
          <p className="page-message">
            Chargement de vos demandes...
          </p>
        )}

        {/* Message d'erreur. */}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {/* Message quand aucune demande n'existe. */}
        {!loading && !error && demandes.length === 0 && (
          <section className="empty-box">
            {/* Titre du message vide. */}
            <h2>Aucune demande envoyée</h2>

            {/* Explication du message vide. */}
            <p>Vous n'avez pas encore fait de demande d'achat.</p>

            {/* Lien vers les annonces publiques. */}
            <Link className="btn btn-primary" to="/annonces">
              Voir les annonces
            </Link>
          </section>
        )}

        {/* Liste des demandes. */}
        {!loading && !error && demandes.length > 0 && (
          <section className="requests-list">
            {/* On parcourt les demandes une par une. */}
            {demandes.map((demande) => (
              // Carte d'une demande.
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

                  {/* Nom du vendeur. */}
                  <p>
                    Vendeur : {demande.vendeurNomComplet || "Vendeur inconnu"}
                  </p>

                  {/* Date de la demande. */}
                  <p>
                    Demande envoyée le : {formatDate(demande.dateDemande)}
                  </p>

                  {/* Message envoyé au vendeur. */}
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
                        Échanger avec le vendeur
                    </Link>
                    )}

                    {/* On affiche le bouton Annuler seulement si la demande est en attente. */}
                    {demande.statut === "En attente" && (
                        <button
                        // Le bouton ne soumet pas de formulaire.
                        type="button"

                        // Classe CSS du bouton.
                        className="btn btn-danger"

                        // Fonction appelée au clic.
                        onClick={() => handleCancelDemande(demande.id)}

                        // On désactive le bouton pendant l'annulation.
                        disabled={cancelLoadingId === demande.id}
                        >
                        {/* Texte du bouton selon l'état. */}
                        {cancelLoadingId === demande.id ? "Annulation..." : "Annuler"}
                        </button>
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