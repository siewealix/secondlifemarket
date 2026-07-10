// On importe useEffect pour charger les signalements au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe Link pour naviguer vers les annonces.
import { Link } from "react-router-dom";

// On importe les fonctions API des signalements.
import {
  getSignalementsAnnoncesAdminRequest,
  getSignalementsUtilisateursAdminRequest,
  traiterSignalementAnnonceRequest,
  traiterSignalementUtilisateurRequest,
} from "../../api/signalementApi.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le menu latéral admin.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// Page admin pour gérer les signalements.
export default function ManageReportsPage() {
  // On récupère le token de l'administrateur connecté.
  const { accessToken } = useAuth();

  // On stocke les signalements d'annonces.
  const [signalementsAnnonces, setSignalementsAnnonces] = useState([]);

  // On stocke les signalements d'utilisateurs.
  const [signalementsUtilisateurs, setSignalementsUtilisateurs] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke le message de succès.
  const [success, setSuccess] = useState("");

  // On stocke l'action en cours.
  const [processingAction, setProcessingAction] = useState("");

  // Cette fonction formate une date.
  function formatDate(dateValue) {
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

  // Cette fonction charge les deux types de signalements.
  async function loadSignalements() {
    // On vide l'ancien message d'erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les signalements.
    try {
      // On charge les signalements d'annonces.
      const annoncesData = await getSignalementsAnnoncesAdminRequest(accessToken);

      // On charge les signalements d'utilisateurs.
      const utilisateursData = await getSignalementsUtilisateursAdminRequest(accessToken);

      // On stocke les signalements d'annonces.
      setSignalementsAnnonces(annoncesData);

      // On stocke les signalements d'utilisateurs.
      setSignalementsUtilisateurs(utilisateursData);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // Cette fonction traite un signalement d'annonce.
  async function handleTraiterAnnonce(signalementId, action) {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On demande une remarque à l'administrateur.
    const decisionAdmin = window.prompt("Décision ou remarque de l'administrateur :");

    // On vérifie si l'administrateur a annulé.
    if (decisionAdmin === null) {
      // On arrête la fonction.
      return;
    }

    // On prépare l'identifiant de l'action en cours.
    setProcessingAction(`annonce-${action}-${signalementId}`);

    // On essaie de traiter le signalement.
    try {
      // On appelle l'API React.
      await traiterSignalementAnnonceRequest(signalementId, action, decisionAdmin, accessToken);

      // On retire le signalement traité de la liste.
      setSignalementsAnnonces((oldSignalements) =>
        oldSignalements.filter((signalement) => signalement.id !== signalementId)
      );

      // On affiche un message de succès.
      setSuccess(`Signalement d'annonce ${action === "valider" ? "validé" : "rejeté"} avec succès.`);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête l'action en cours.
      setProcessingAction("");
    }
  }

  // Cette fonction traite un signalement d'utilisateur.
  async function handleTraiterUtilisateur(signalementId, action) {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On demande une remarque à l'administrateur.
    const decisionAdmin = window.prompt("Décision ou remarque de l'administrateur :");

    // On vérifie si l'administrateur a annulé.
    if (decisionAdmin === null) {
      // On arrête la fonction.
      return;
    }

    // On prépare l'identifiant de l'action en cours.
    setProcessingAction(`utilisateur-${action}-${signalementId}`);

    // On essaie de traiter le signalement.
    try {
      // On appelle l'API React.
      await traiterSignalementUtilisateurRequest(signalementId, action, decisionAdmin, accessToken);

      // On retire le signalement traité de la liste.
      setSignalementsUtilisateurs((oldSignalements) =>
        oldSignalements.filter((signalement) => signalement.id !== signalementId)
      );

      // On affiche un message de succès.
      setSuccess(`Signalement d'utilisateur ${action === "valider" ? "validé" : "rejeté"} avec succès.`);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête l'action en cours.
      setProcessingAction("");
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge les signalements.
      loadSignalements();
    }
  }, [accessToken]);

  // On affiche la page.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On affiche la structure admin. */}
      <main className="admin-layout-page">
        {/* On affiche le menu latéral admin. */}
        <AdminSidebar />

        {/* On affiche le contenu principal. */}
        <section className="admin-content-page">
          {/* En-tête de la page. */}
          <div className="admin-page-header">
            {/* Titre principal. */}
            <h1>Gestion des signalements</h1>

            {/* Description de la page. */}
            <p>Consultez et traitez les signalements envoyés par les membres.</p>
          </div>

          {/* Message de chargement. */}
          {loading && (
            <p className="page-message">
              Chargement des signalements...
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

          {/* Liste des signalements d'annonces. */}
          {!loading && (
            <section className="admin-report-section">
              {/* Titre de section. */}
              <h2>Signalements d'annonces</h2>

              {/* Message vide. */}
              {signalementsAnnonces.length === 0 && (
                <p className="empty-message">
                  Aucun signalement d'annonce en attente.
                </p>
              )}

              {/* Liste des cartes. */}
              <div className="admin-report-list">
                {/* On parcourt les signalements d'annonces. */}
                {signalementsAnnonces.map((signalement) => (
                  // Carte d'un signalement d'annonce.
                  <article className="admin-report-card" key={signalement.id}>
                    {/* Motif du signalement. */}
                    <h3>{signalement.motif}</h3>

                    {/* Description du signalement. */}
                    <p>{signalement.description}</p>

                    {/* Informations du signalement. */}
                    <div className="admin-report-details">
                      <span>Annonce : {signalement.annonceTitre}</span>
                      <span>Signalé par : {signalement.signaleurNomComplet}</span>
                      <span>Date : {formatDate(signalement.dateSignalement)}</span>
                      <span>Statut : {signalement.statutSignalement}</span>
                    </div>

                    {/* Actions du signalement. */}
                    <div className="admin-report-actions">
                      {/* Lien vers l'annonce. */}
                      <Link className="btn btn-secondary" to={`/annonces/${signalement.annonceId}`}>
                        Voir l'annonce
                      </Link>

                      {/* Bouton valider. */}
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleTraiterAnnonce(signalement.id, "valider")}
                        disabled={processingAction !== ""}
                      >
                        {processingAction === `annonce-valider-${signalement.id}` ? "Validation..." : "Valider"}
                      </button>

                      {/* Bouton rejeter. */}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleTraiterAnnonce(signalement.id, "rejeter")}
                        disabled={processingAction !== ""}
                      >
                        {processingAction === `annonce-rejeter-${signalement.id}` ? "Rejet..." : "Rejeter"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Liste des signalements d'utilisateurs. */}
          {!loading && (
            <section className="admin-report-section">
              {/* Titre de section. */}
              <h2>Signalements d'utilisateurs</h2>

              {/* Message vide. */}
              {signalementsUtilisateurs.length === 0 && (
                <p className="empty-message">
                  Aucun signalement d'utilisateur en attente.
                </p>
              )}

              {/* Liste des cartes. */}
              <div className="admin-report-list">
                {/* On parcourt les signalements d'utilisateurs. */}
                {signalementsUtilisateurs.map((signalement) => (
                  // Carte d'un signalement d'utilisateur.
                  <article className="admin-report-card" key={signalement.id}>
                    {/* Motif du signalement. */}
                    <h3>{signalement.motif}</h3>

                    {/* Description du signalement. */}
                    <p>{signalement.description}</p>

                    {/* Informations du signalement. */}
                    <div className="admin-report-details">
                      <span>Utilisateur signalé : {signalement.utilisateurSignaleNomComplet}</span>
                      <span>Signalé par : {signalement.signaleurNomComplet}</span>
                      <span>Date : {formatDate(signalement.dateSignalement)}</span>
                      <span>Statut : {signalement.statutSignalement}</span>
                    </div>

                    {/* Actions du signalement. */}
                    <div className="admin-report-actions">
                      {/* Bouton valider. */}
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleTraiterUtilisateur(signalement.id, "valider")}
                        disabled={processingAction !== ""}
                      >
                        {processingAction === `utilisateur-valider-${signalement.id}` ? "Validation..." : "Valider"}
                      </button>

                      {/* Bouton rejeter. */}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleTraiterUtilisateur(signalement.id, "rejeter")}
                        disabled={processingAction !== ""}
                      >
                        {processingAction === `utilisateur-rejeter-${signalement.id}` ? "Rejet..." : "Rejeter"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}