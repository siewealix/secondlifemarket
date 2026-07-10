// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe les fonctions API des abonnements.
import {
  getMonAbonnementRequest,
  getOffresAbonnementRequest,
  souscrireAbonnementRequest,
  resilierAbonnementRequest,
} from "../../api/abonnementApi.js";

// Page vendeur pour gérer l'abonnement.
export default function SellerSubscriptionPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke les offres d'abonnement.
  const [offres, setOffres] = useState([]);

  // On stocke l'abonnement actuel du membre.
  const [monAbonnement, setMonAbonnement] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'erreur.
  const [error, setError] = useState("");

  // On stocke le message de succès.
  const [success, setSuccess] = useState("");

  // On stocke l'offre en cours de souscription.
  const [processingType, setProcessingType] = useState("");

  // Cette fonction formate une date.
  function formatDate(dateValue) {
    // On vérifie si la date existe.
    if (!dateValue) {
      // On retourne un texte simple.
      return "Non défini";
    }

    // On crée une date JavaScript.
    const date = new Date(dateValue);

    // On vérifie si la date est invalide.
    if (Number.isNaN(date.getTime())) {
      // On retourne un texte simple.
      return "Date inconnue";
    }

    // On retourne la date en français.
    return date.toLocaleDateString("fr-FR");
  }

  // Cette fonction charge les offres et l'abonnement du membre.
  async function loadAbonnementData() {
    // On vide l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les données.
    try {
      // On récupère l'abonnement actuel.
      const abonnementData = await getMonAbonnementRequest(accessToken);

      // On récupère les offres disponibles.
      const offresData = await getOffresAbonnementRequest(accessToken);

      // On stocke l'abonnement.
      setMonAbonnement(abonnementData);

      // On stocke les offres.
      setOffres(offresData);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // Cette fonction souscrit à une offre.
  async function handleSouscrire(typeAbonnement) {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On demande confirmation.
    const confirmed = window.confirm(`Voulez-vous souscrire à l'offre ${typeAbonnement} ?`);

    // On arrête si le membre annule.
    if (!confirmed) {
      return;
    }

    // On indique l'offre en cours de traitement.
    setProcessingType(typeAbonnement);

    // On essaie de souscrire.
    try {
      // On appelle le backend.
      await souscrireAbonnementRequest(typeAbonnement, accessToken);

      // On affiche un message de succès.
      setSuccess("Votre abonnement a été activé avec succès.");

      // On recharge les informations.
      await loadAbonnementData();
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête le traitement.
      setProcessingType("");
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge les données.
      loadAbonnementData();
    }
  }, [accessToken]);

  // Cette fonction résilie l'abonnement actif du membre.
async function handleResilierAbonnement() {
  // On vide les anciens messages.
  setError("");
  setSuccess("");

  // On demande une confirmation.
  const confirmed = window.confirm(
    "Voulez-vous vraiment résilier votre abonnement ? Votre limite reviendra à 3 publications."
  );

  // Si le membre annule, on arrête.
  if (!confirmed) {
    // On sort de la fonction.
    return;
  }

  // On indique qu'une action est en cours.
  setProcessingType("resiliation");

  // On essaie de résilier.
  try {
    // On appelle le backend.
    const abonnementData = await resilierAbonnementRequest(accessToken);

    // On met à jour l'abonnement affiché.
    setMonAbonnement(abonnementData);

    // On affiche un message de succès.
    setSuccess("Votre abonnement a été résilié avec succès.");
  } catch (error) {
    // On affiche l'erreur.
    setError(error.message);
  } finally {
    // On arrête le traitement.
    setProcessingType("");
  }
}

  // On retourne la page.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* Contenu principal. */}
      <main className="page-section subscription-page">
        {/* Conteneur principal. */}
        <div className="container">
          {/* En-tête de la page. */}
          <div className="section-heading">
            {/* Petit titre. */}
            <span className="section-kicker">Abonnement vendeur</span>

            {/* Titre principal. */}
            <h1>Gérer mon abonnement</h1>

            {/* Description. */}
            <p>
              Sans abonnement, vous pouvez publier jusqu’à 3 annonces. Choisissez une offre pour augmenter votre limite.
            </p>
          </div>

          {/* Message de chargement. */}
          {loading && (
            <p className="page-message">
              Chargement de votre abonnement...
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

          {/* Informations de l'abonnement actuel. */}
          {!loading && monAbonnement && (
            <section className="my-subscription-card">
              {/* Titre. */}
              <h2>Ma situation actuelle</h2>

              {/* Message explicatif. */}
              <p>{monAbonnement.message}</p>

              {/* Grille des informations. */}
              <div className="subscription-stats-grid">
                {/* Type d'abonnement. */}
                <div className="subscription-stat">
                  <span>Type</span>
                  <strong>{monAbonnement.typeAbonnement}</strong>
                </div>

                {/* Statut. */}
                <div className="subscription-stat">
                  <span>Statut</span>
                  <strong>{monAbonnement.statutAbonnement}</strong>
                </div>

                {/* Limite. */}
                <div className="subscription-stat">
                  <span>Limite</span>
                  <strong>{monAbonnement.limitePublication} annonces</strong>
                </div>

                {/* Utilisées. */}
                <div className="subscription-stat">
                  <span>Utilisées</span>
                  <strong>{monAbonnement.nombrePublicationsUtilisees}</strong>
                </div>

                {/* Restantes. */}
                <div className="subscription-stat">
                  <span>Restantes</span>
                  <strong>{monAbonnement.nombrePublicationsRestantes}</strong>
                </div>

                {/* Date de fin. */}
                <div className="subscription-stat">
                  <span>Fin</span>
                  <strong>{formatDate(monAbonnement.dateFin)}</strong>
                </div>

                {/* Bouton de résiliation affiché seulement si l'abonnement est actif. */}
                {monAbonnement?.abonnementActif && (
                  <button
                    // Type bouton.
                    type="button"

                    // Classe du bouton.
                    className="btn btn-danger"

                    // Action au clic.
                    onClick={handleResilierAbonnement}

                    // On désactive pendant le traitement.
                    disabled={processingType !== ""}
                  >
                    {/* Texte du bouton. */}
                    {processingType === "resiliation" ? "Résiliation..." : "Résilier mon abonnement"}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Liste des offres. */}
          {!loading && (
            <section className="subscription-offers-section">
              {/* Titre. */}
              <h2>Offres disponibles</h2>

              {/* Grille des offres. */}
              <div className="subscription-offers-grid">
                {/* On parcourt les offres. */}
                {offres.map((offre) => (
                  // Carte d'une offre.
                  <article className="subscription-offer-card" key={offre.typeAbonnement}>
                    {/* Nom de l'offre. */}
                    <h3>{offre.typeAbonnement}</h3>

                    {/* Description. */}
                    <p>{offre.description}</p>

                    {/* Prix. */}
                    <div className="subscription-price">
                      {offre.prix} FCFA
                    </div>

                    {/* Détails. */}
                    <ul>
                      <li>Durée : {offre.dureeJours} jours</li>
                      <li>Limite : {offre.limitePublication} annonces</li>
                    </ul>

                    {/* Bouton de souscription. */}
                    <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSouscrire(offre.typeAbonnement)}
                    disabled={processingType !== ""}
                  >
                    {processingType === offre.typeAbonnement
                      ? "Traitement..."
                      : monAbonnement?.abonnementActif
                        ? "Changer d'offre"
                        : "Souscrire"}
                  </button>

                    {/* Message si le membre a déjà un abonnement. */}
                    {monAbonnement?.typeAbonnement === offre.typeAbonnement && monAbonnement?.statutAbonnement === "Actif" && (
                      <p className="subscription-note">
                        Offre actuellement active.
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}