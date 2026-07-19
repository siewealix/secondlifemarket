// On importe les hooks React nécessaires.
import { useCallback, useEffect, useState } from "react";

// On importe Link pour revenir au tableau de bord sans recharger la page.
import { Link } from "react-router-dom";

// On importe les icônes utilisées dans la page.
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Crown,
  FileText,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
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

// On crée la page de gestion de l'abonnement vendeur.
export default function SellerSubscriptionPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On mémorise les offres disponibles.
  const [offres, setOffres] = useState([]);

  // On mémorise l'abonnement actuel du membre.
  const [monAbonnement, setMonAbonnement] = useState(null);

  // On mémorise l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On mémorise le message d'erreur.
  const [error, setError] = useState("");

  // On mémorise le message de succès.
  const [success, setSuccess] = useState("");

  // On mémorise l'action actuellement en cours.
  const [processingType, setProcessingType] = useState("");

  // Cette fonction transforme une date en texte français.
  function formatDate(dateValue) {
    // On vérifie si la date existe.
    if (!dateValue) {
      return "Non définie";
    }

    // On crée une date JavaScript.
    const date = new Date(dateValue);

    // On vérifie si la date est valide.
    if (Number.isNaN(date.getTime())) {
      return "Date inconnue";
    }

    // On retourne une date lisible.
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Cette fonction formate un prix avec des espaces.
  function formatPrice(priceValue) {
    // On transforme le prix en nombre.
    const numericPrice = Number(priceValue);

    // On retourne la valeur originale si elle n'est pas valide.
    if (Number.isNaN(numericPrice)) {
      return priceValue;
    }

    // On retourne le prix au format français.
    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  // Cette fonction charge l'abonnement actuel et les offres.
  const loadAbonnementData = useCallback(async () => {
    // On efface l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de récupérer les informations.
    try {
      // On lance les deux requêtes en même temps.
      const [abonnementData, offresData] = await Promise.all([
        getMonAbonnementRequest(accessToken),
        getOffresAbonnementRequest(accessToken),
      ]);

      // On mémorise l'abonnement du membre.
      setMonAbonnement(abonnementData);

      // On vérifie que les offres reçues forment bien un tableau.
      setOffres(Array.isArray(offresData) ? offresData : []);

      // On indique que le chargement a réussi.
      return true;
    } catch (error) {
      // On affiche une erreur claire.
      setError(
        error.message ||
          "Impossible de charger les informations de votre abonnement."
      );

      // On indique que le chargement a échoué.
      return false;
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }, [accessToken]);

  // Ce bloc se lance lorsque le token est disponible.
  useEffect(() => {
    // On vérifie que le membre possède un token.
    if (accessToken) {
      // On charge les informations.
      loadAbonnementData();
    }
  }, [accessToken, loadAbonnementData]);

  // Cette fonction permet de choisir une offre.
  async function handleSouscrire(typeAbonnement) {
    // On vérifie si cette offre est déjà active.
    const offreDejaActive =
      monAbonnement?.abonnementActif &&
      monAbonnement?.typeAbonnement === typeAbonnement;

    // On arrête pour éviter une requête inutile.
    if (offreDejaActive) {
      return;
    }

    // On efface les anciens messages.
    setError("");
    setSuccess("");

    // On prépare un message adapté à la situation du membre.
    const confirmationMessage = monAbonnement?.abonnementActif
      ? `Voulez-vous remplacer votre abonnement actuel par l’offre ${typeAbonnement} ?`
      : `Voulez-vous souscrire à l’offre ${typeAbonnement} ?`;

    // On demande une confirmation.
    const confirmed = window.confirm(confirmationMessage);

    // On arrête si le membre annule.
    if (!confirmed) {
      return;
    }

    // On mémorise l'offre en cours de traitement.
    setProcessingType(typeAbonnement);

    // On essaie d'effectuer la souscription.
    try {
      // On appelle le backend.
      await souscrireAbonnementRequest(typeAbonnement, accessToken);

      // On recharge les informations mises à jour.
      const rechargementReussi = await loadAbonnementData();

      // On affiche le succès seulement si le rechargement a réussi.
      if (rechargementReussi) {
        setSuccess("Votre abonnement a été activé avec succès.");
      }
    } catch (error) {
      // On affiche l'erreur retournée par le backend.
      setError(
        error.message ||
          "Impossible de souscrire à cette offre pour le moment."
      );
    } finally {
      // On indique que le traitement est terminé.
      setProcessingType("");
    }
  }

  // Cette fonction résilie l'abonnement actif.
  async function handleResilierAbonnement() {
    // On efface les anciens messages.
    setError("");
    setSuccess("");

    // On demande une confirmation.
    const confirmed = window.confirm(
      "Voulez-vous vraiment résilier votre abonnement ? Votre limite reviendra à 3 publications."
    );

    // On arrête si le membre annule.
    if (!confirmed) {
      return;
    }

    // On indique qu'une résiliation est en cours.
    setProcessingType("resiliation");

    // On essaie de résilier l'abonnement.
    try {
      // On appelle le backend.
      const abonnementData =
        await resilierAbonnementRequest(accessToken);

      // On affiche immédiatement la nouvelle situation.
      setMonAbonnement(abonnementData);

      // On affiche le message de succès.
      setSuccess("Votre abonnement a été résilié avec succès.");
    } catch (error) {
      // On affiche l'erreur retournée par le backend.
      setError(
        error.message ||
          "Impossible de résilier votre abonnement pour le moment."
      );
    } finally {
      // On indique que le traitement est terminé.
      setProcessingType("");
    }
  }

  // On récupère la limite totale.
  const limitePublication = Number(
    monAbonnement?.limitePublication ?? 0
  );

  // On récupère le nombre de publications utilisées.
  const publicationsUtilisees = Number(
    monAbonnement?.nombrePublicationsUtilisees ?? 0
  );

  // On récupère le nombre de publications restantes.
  const publicationsRestantes = Number(
    monAbonnement?.nombrePublicationsRestantes ?? 0
  );

  // On calcule le pourcentage de la limite déjà utilisé.
  const pourcentageUtilise =
    limitePublication > 0
      ? Math.min(
          Math.round(
            (publicationsUtilisees / limitePublication) * 100
          ),
          100
        )
      : 0;

  // On vérifie si un abonnement est actuellement actif.
  const abonnementActif = Boolean(monAbonnement?.abonnementActif);

  // On retourne la page.
  return (
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="subscription-page">
        {/* On limite la largeur de la page. */}
        <div className="subscription-page-container">

          {/* On affiche l'en-tête principal. */}
          <section className="subscription-hero">
            {/* On affiche le bouton de retour. */}
            <Link
              className="subscription-back-link"
              to="/membre/vendeur"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Retour au tableau de bord
            </Link>

            {/* On organise le texte et la limite actuelle. */}
            <div className="subscription-hero-layout">
              {/* On affiche le texte principal. */}
              <div className="subscription-hero-content">
                {/* On affiche le petit titre. */}
                <span className="subscription-hero-kicker">
                  <Crown size={17} aria-hidden="true" />
                  Abonnement vendeur
                </span>

                {/* On affiche le titre principal. */}
                <h1>Choisissez votre rythme de publication</h1>

                {/* On affiche une explication. */}
                <p>
                  Consultez votre utilisation actuelle et choisissez
                  l’offre qui correspond le mieux au nombre d’annonces
                  que vous souhaitez publier.
                </p>

                {/* On affiche quelques informations importantes. */}
                <div className="subscription-hero-points">
                  <span>
                    <ShieldCheck size={18} aria-hidden="true" />
                    3 publications avec l’offre gratuite
                  </span>

                  <span>
                    <FileText size={18} aria-hidden="true" />

                    {loading
                      ? "Chargement des offres..."
                      : `${offres.length} offre${
                          offres.length > 1 ? "s" : ""
                        } disponible${
                          offres.length > 1 ? "s" : ""
                        }`}
                  </span>
                </div>
              </div>

              {/* On affiche la limite réelle du membre. */}
              <div
                className="subscription-hero-limit"
                aria-label="Limite actuelle de publication"
              >
                <span>Ma limite actuelle</span>

                <strong>
                  {loading ? "—" : limitePublication}
                </strong>

                <small>annonces</small>
              </div>
            </div>
          </section>

          {/* On affiche le message de succès. */}
          {success && (
            <div
              className="subscription-feedback subscription-feedback-success"
              role="status"
            >
              <BadgeCheck size={24} aria-hidden="true" />

              <div>
                <strong>Opération réussie</strong>
                <p>{success}</p>
              </div>
            </div>
          )}

          {/* On affiche le message d'erreur. */}
          {error && (
            <div
              className="subscription-feedback subscription-feedback-error"
              role="alert"
            >
              <CircleAlert size={24} aria-hidden="true" />

              <div className="subscription-feedback-content">
                <strong>Une erreur est survenue</strong>
                <p>{error}</p>
              </div>

              {/* On permet de recommencer le chargement. */}
              <button
                type="button"
                className="subscription-retry-button"
                onClick={loadAbonnementData}
                disabled={loading}
              >
                <RefreshCw size={17} aria-hidden="true" />
                Réessayer
              </button>
            </div>
          )}

          {/* On affiche l'état de chargement. */}
          {loading && (
            <section
              className="subscription-loading-card"
              aria-live="polite"
            >
              <LoaderCircle
                className="subscription-spinner"
                size={36}
                aria-hidden="true"
              />

              <h2>Chargement de votre abonnement</h2>

              <p>
                Nous récupérons votre limite et les offres disponibles.
              </p>
            </section>
          )}

          {/* On affiche la situation actuelle. */}
          {!loading && monAbonnement && (
            <section className="subscription-current-card">
              {/* On affiche l'en-tête de la carte. */}
              <div className="subscription-current-header">
                {/* On affiche le titre. */}
                <div className="subscription-current-title">
                  <div className="subscription-current-icon">
                    <Crown size={25} aria-hidden="true" />
                  </div>

                  <div>
                    <span>Votre compte vendeur</span>
                    <h2>Ma situation actuelle</h2>
                  </div>
                </div>

                {/* On affiche le statut réel. */}
                <span
                  className={
                    abonnementActif
                      ? "subscription-status is-active"
                      : "subscription-status is-inactive"
                  }
                >
                  {abonnementActif ? (
                    <BadgeCheck size={17} aria-hidden="true" />
                  ) : (
                    <CircleAlert size={17} aria-hidden="true" />
                  )}

                  {monAbonnement.statutAbonnement}
                </span>
              </div>

              {/* On affiche le message envoyé par le backend. */}
              <p className="subscription-current-message">
                {monAbonnement.message}
              </p>

              {/* On sépare l'utilisation et les détails. */}
              <div className="subscription-summary-layout">
                {/* On affiche l'utilisation des publications. */}
                <div className="subscription-usage-panel">
                  <div className="subscription-usage-heading">
                    <div>
                      <span>Utilisation de la limite</span>

                      <strong>
                        {publicationsUtilisees} sur{" "}
                        {limitePublication}
                      </strong>
                    </div>

                    <span>{pourcentageUtilise}% utilisé</span>
                  </div>

                  {/* On affiche la barre de progression. */}
                  <div
                    className="subscription-progress-track"
                    role="progressbar"
                    aria-label="Publications utilisées"
                    aria-valuemin="0"
                    aria-valuemax={limitePublication}
                    aria-valuenow={publicationsUtilisees}
                  >
                    <div
                      className={
                        monAbonnement.peutPublier
                          ? "subscription-progress-value"
                          : "subscription-progress-value is-full"
                      }
                      style={{
                        width: `${pourcentageUtilise}%`,
                      }}
                    />
                  </div>

                  {/* On affiche les trois chiffres principaux. */}
                  <div className="subscription-count-grid">
                    <div className="subscription-count-item">
                      <span>Limite</span>
                      <strong>{limitePublication}</strong>
                    </div>

                    <div className="subscription-count-item">
                      <span>Utilisées</span>
                      <strong>{publicationsUtilisees}</strong>
                    </div>

                    <div className="subscription-count-item">
                      <span>Restantes</span>
                      <strong>{publicationsRestantes}</strong>
                    </div>
                  </div>
                </div>

                {/* On affiche les détails de l'abonnement. */}
                <div className="subscription-details-panel">
                  <h3>Détails de l’offre</h3>

                  <div className="subscription-detail-row">
                    <span>
                      <FileText size={18} aria-hidden="true" />
                      Type
                    </span>

                    <strong>
                      {monAbonnement.typeAbonnement}
                    </strong>
                  </div>

                  <div className="subscription-detail-row">
                    <span>
                      <CalendarDays
                        size={18}
                        aria-hidden="true"
                      />
                      Date de début
                    </span>

                    <strong>
                      {formatDate(monAbonnement.dateDebut)}
                    </strong>
                  </div>

                  <div className="subscription-detail-row">
                    <span>
                      <Clock3 size={18} aria-hidden="true" />
                      Date de fin
                    </span>

                    <strong>
                      {formatDate(monAbonnement.dateFin)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* On affiche le bas de la carte. */}
              <div className="subscription-current-footer">
                {/* On affiche l'état de publication. */}
                <div className="subscription-publication-state">
                  {monAbonnement.peutPublier ? (
                    <ShieldCheck size={21} aria-hidden="true" />
                  ) : (
                    <CircleAlert size={21} aria-hidden="true" />
                  )}

                  <span>
                    {monAbonnement.peutPublier
                      ? `Vous pouvez encore publier ${publicationsRestantes} annonce${
                          publicationsRestantes > 1 ? "s" : ""
                        }.`
                      : "Votre limite de publication est atteinte."}
                  </span>
                </div>

                {/* On affiche la résiliation seulement si l'abonnement est actif. */}
                {abonnementActif && (
                  <button
                    type="button"
                    className="subscription-cancel-button"
                    onClick={handleResilierAbonnement}
                    disabled={processingType !== ""}
                  >
                    {processingType === "resiliation" ? (
                      <LoaderCircle
                        className="subscription-button-spinner"
                        size={18}
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle size={18} aria-hidden="true" />
                    )}

                    {processingType === "resiliation"
                      ? "Résiliation..."
                      : "Résilier mon abonnement"}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* On affiche les offres si elles ont été chargées. */}
          {!loading && (offres.length > 0 || !error) && (
            <section
              className="subscription-offers-section"
              aria-labelledby="subscription-offers-title"
            >
              {/* On affiche l'en-tête des offres. */}
              <div className="subscription-offers-heading">
                <div>
                  <span>Choisir une formule</span>

                  <h2 id="subscription-offers-title">
                    Offres disponibles
                  </h2>

                  <p>
                    Comparez les prix, les durées et les limites de
                    publication.
                  </p>
                </div>

                <span className="subscription-offers-count">
                  {offres.length} offre
                  {offres.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* On vérifie si des offres existent. */}
              {offres.length > 0 ? (
                <div className="subscription-offers-grid">
                  {/* On parcourt les offres du backend. */}
                  {offres.map((offre) => {
                    // On vérifie si cette offre est active.
                    const offreActuelle =
                      abonnementActif &&
                      monAbonnement?.typeAbonnement ===
                        offre.typeAbonnement;

                    // On vérifie si cette offre est en traitement.
                    const offreEnTraitement =
                      processingType === offre.typeAbonnement;

                    // On retourne la carte de l'offre.
                    return (
                      <article
                        className={
                          offreActuelle
                            ? "subscription-offer-card is-current"
                            : "subscription-offer-card"
                        }
                        key={offre.typeAbonnement}
                      >
                        {/* On affiche le haut de la carte. */}
                        <div className="subscription-offer-top">
                          <div className="subscription-offer-icon">
                            <Crown size={24} aria-hidden="true" />
                          </div>

                          {/* On signale l'offre active. */}
                          {offreActuelle && (
                            <span className="subscription-current-label">
                              <BadgeCheck
                                size={16}
                                aria-hidden="true"
                              />
                              Offre actuelle
                            </span>
                          )}
                        </div>

                        {/* On affiche le nom de l'offre. */}
                        <h3>{offre.typeAbonnement}</h3>

                        {/* On affiche la description du backend. */}
                        <p className="subscription-offer-description">
                          {offre.description}
                        </p>

                        {/* On affiche le prix réel. */}
                        <div className="subscription-offer-price">
                          <strong>
                            {formatPrice(offre.prix)}
                          </strong>

                          <span>FCFA</span>
                        </div>

                        {/* On affiche la durée. */}
                        <p className="subscription-offer-duration">
                          pour {offre.dureeJours} jours
                        </p>

                        {/* On affiche les caractéristiques réelles. */}
                        <ul className="subscription-offer-features">
                          <li>
                            <Check size={18} aria-hidden="true" />

                            Jusqu’à {offre.limitePublication}{" "}
                            annonces
                          </li>

                          <li>
                            <Check size={18} aria-hidden="true" />

                            Durée de {offre.dureeJours} jours
                          </li>
                        </ul>

                        {/* On affiche le bouton de sélection. */}
                        <button
                          type="button"
                          className="subscription-offer-button"
                          onClick={() =>
                            handleSouscrire(
                              offre.typeAbonnement
                            )
                          }
                          disabled={
                            processingType !== "" ||
                            offreActuelle
                          }
                        >
                          {offreEnTraitement ? (
                            <LoaderCircle
                              className="subscription-button-spinner"
                              size={18}
                              aria-hidden="true"
                            />
                          ) : offreActuelle ? (
                            <BadgeCheck
                              size={18}
                              aria-hidden="true"
                            />
                          ) : (
                            <Check
                              size={18}
                              aria-hidden="true"
                            />
                          )}

                          {offreEnTraitement
                            ? "Traitement..."
                            : offreActuelle
                              ? "Offre actuelle"
                              : abonnementActif
                                ? "Changer pour cette offre"
                                : "Choisir cette offre"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              ) : (
                // On affiche ce message lorsqu'aucune offre n'existe.
                <div className="subscription-empty-state">
                  <Crown size={34} aria-hidden="true" />

                  <h3>Aucune offre disponible</h3>

                  <p>
                    Aucune offre supplémentaire n’est proposée pour
                    le moment.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* On affiche le pied de page. */}
      <Footer />
    </>
  );
}