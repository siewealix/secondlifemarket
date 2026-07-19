// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe Link pour créer des liens internes.
import { Link } from "react-router-dom";

// On importe les icônes utilisées dans la page.
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  FilePlus2,
  Gauge,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction API du tableau de bord.
import { getVendeurDashboardRequest } from "../../api/tableauBordApi.js";

// On crée la page du tableau de bord vendeur.
export default function SellerDashboardPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke les statistiques du vendeur.
  const [dashboard, setDashboard] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // Cette fonction charge les statistiques du vendeur.
  async function loadDashboard() {
    // On vide l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    try {
      // On appelle le backend.
      const data = await getVendeurDashboardRequest(accessToken);

      // On stocke les statistiques reçues.
      setDashboard(data);
    } catch (error) {
      // On affiche le message d'erreur.
      setError(error.message);
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // Ce bloc se lance lorsque le token est disponible.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge le tableau de bord.
      loadDashboard();
    }
  }, [accessToken]);

  // On récupère la limite de publication.
  const publicationLimit = dashboard?.limitePublication ?? 0;

  // On récupère le nombre de publications utilisées.
  const publicationsUsed = dashboard?.publicationsUtilisees ?? 0;

  // On calcule le pourcentage de publications utilisées.
  const publicationProgress =
    publicationLimit > 0
      ? Math.min((publicationsUsed / publicationLimit) * 100, 100)
      : 0;

  // On retourne l'interface.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="page-section seller-dashboard-page">
        {/* On centre le contenu. */}
        <div className="container seller-dashboard-container">
          {/* On crée le bandeau principal. */}
          <header className="seller-dashboard-header">
            {/* On crée la partie gauche du bandeau. */}
            <div className="seller-dashboard-header-content">
              {/* On permet de retourner à l'espace membre. */}
              <Link
                className="seller-dashboard-back"
                to="/membre"
              >
                <ArrowLeft size={18} aria-hidden="true" />

                Retour à l’espace membre
              </Link>

              {/* On affiche le type d'espace. */}
              <span className="seller-dashboard-label">
                <LayoutDashboard size={17} aria-hidden="true" />

                Espace vente
              </span>

              {/* On affiche le titre principal. */}
              <h1>Tableau de bord vendeur</h1>

              {/* On présente la page. */}
              <p>
                Suivez vos annonces, consultez les demandes reçues et contrôlez
                votre capacité de publication depuis un seul espace.
              </p>
            </div>

            {/* On affiche l'action principale. */}
            <Link
              className="seller-dashboard-primary-action"
              to="/membre/vendeur/annonces/nouvelle"
            >
              <FilePlus2 size={20} aria-hidden="true" />

              Publier une annonce
            </Link>
          </header>

          {/* On affiche le chargement. */}
          {loading && (
            <div
              className="seller-dashboard-loading"
              role="status"
            >
              {/* On affiche une icône animée. */}
              <LoaderCircle
                className="seller-loading-icon"
                size={34}
                aria-hidden="true"
              />

              {/* On affiche le message. */}
              <div>
                <strong>Chargement en cours</strong>

                <p>Nous préparons votre tableau de bord vendeur.</p>
              </div>
            </div>
          )}

          {/* On affiche l'erreur. */}
          {!loading && error && (
            <div
              className="seller-dashboard-error"
              role="alert"
            >
              {/* On affiche l'icône d'erreur. */}
              <CircleAlert size={30} aria-hidden="true" />

              {/* On affiche le contenu de l'erreur. */}
              <div>
                <strong>Impossible de charger le tableau de bord</strong>

                <p>{error}</p>

                {/* On permet de relancer le chargement. */}
                <button
                  type="button"
                  className="seller-retry-button"
                  onClick={loadDashboard}
                >
                  <RefreshCw size={17} aria-hidden="true" />

                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* On affiche les données reçues. */}
          {!loading && !error && dashboard && (
            <>
              {/* On affiche la limite de publication. */}
              <section
                className={
                  dashboard.peutEncorePublier
                    ? "seller-limit-card"
                    : "seller-limit-card seller-limit-card-warning"
                }
              >
                {/* On crée l'en-tête de la carte. */}
                <div className="seller-limit-header">
                  {/* On affiche l'icône de la carte. */}
                  <span
                    className="seller-limit-icon"
                    aria-hidden="true"
                  >
                    {dashboard.peutEncorePublier ? (
                      <Gauge size={30} />
                    ) : (
                      <TriangleAlert size={30} />
                    )}
                  </span>

                  {/* On affiche le titre et le message. */}
                  <div className="seller-limit-heading">
                    <span>Votre offre actuelle</span>

                    <h2>Capacité de publication</h2>

                    <p>{dashboard.messagePublication}</p>
                  </div>

                  {/* On affiche l'état de la capacité. */}
                  <span
                    className={
                      dashboard.peutEncorePublier
                        ? "seller-limit-status"
                        : "seller-limit-status seller-limit-status-warning"
                    }
                  >
                    {dashboard.peutEncorePublier
                      ? "Publication disponible"
                      : "Limite atteinte"}
                  </span>
                </div>

                {/* On affiche la barre de progression. */}
                {publicationLimit > 0 && (
                  <div className="seller-progress-container">
                    {/* On affiche les informations de progression. */}
                    <div className="seller-progress-label">
                      <span>Utilisation de votre limite</span>

                      <strong>
                        {publicationsUsed} sur {publicationLimit}
                      </strong>
                    </div>

                    {/* On crée la barre. */}
                    <div
                      className="seller-progress-track"
                      role="progressbar"
                      aria-label="Utilisation de la limite de publication"
                      aria-valuemin="0"
                      aria-valuemax={publicationLimit}
                      aria-valuenow={publicationsUsed}
                    >
                      {/* On affiche la progression réelle. */}
                      <span
                        className="seller-progress-value"
                        style={{
                          width: `${publicationProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* On affiche les valeurs de publication. */}
                <div className="seller-limit-grid">
                  {/* On affiche la limite totale. */}
                  <div className="seller-limit-item">
                    <span>Limite actuelle</span>

                    <strong>{dashboard.limitePublication}</strong>
                  </div>

                  {/* On affiche les publications utilisées. */}
                  <div className="seller-limit-item">
                    <span>Publications utilisées</span>

                    <strong>{dashboard.publicationsUtilisees}</strong>
                  </div>

                  {/* On affiche les publications restantes. */}
                  <div className="seller-limit-item">
                    <span>Publications restantes</span>

                    <strong>{dashboard.publicationsRestantes}</strong>
                  </div>
                </div>

                {/* On affiche un avertissement lorsque la limite est atteinte. */}
                {!dashboard.peutEncorePublier && (
                  <div className="seller-limit-alert">
                    {/* On affiche l'icône d'avertissement. */}
                    <TriangleAlert size={23} aria-hidden="true" />

                    {/* On affiche le texte de l'avertissement. */}
                    <div>
                      <strong>Votre limite est atteinte</strong>

                      <p>
                        Vous pouvez changer d’offre pour publier davantage
                        d’annonces.
                      </p>
                    </div>

                    {/* On affiche le lien vers les abonnements. */}
                    <Link
                      className="seller-limit-alert-link"
                      to="/membre/vendeur/abonnement"
                    >
                      Voir les abonnements

                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </section>

              {/* On affiche les statistiques des annonces. */}
              <section className="seller-dashboard-panel">
                {/* On crée l'en-tête de la partie. */}
                <div className="seller-panel-heading">
                  {/* On affiche le titre. */}
                  <div>
                    <span>Vue d’ensemble</span>

                    <h2>Mes annonces</h2>
                  </div>

                  {/* On permet d'accéder aux annonces. */}
                  <Link to="/membre/vendeur/mes-annonces">
                    Voir mes annonces

                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>

                {/* On affiche les statistiques. */}
                <div className="seller-stats-grid">
                  {/* Nombre total d'annonces. */}
                  <article className="seller-stat-card seller-stat-blue">
                    <span className="seller-stat-icon">
                      <Package size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Total</span>

                      <strong>{dashboard.nombreTotalAnnonces}</strong>
                    </div>
                  </article>

                  {/* Annonces disponibles. */}
                  <article className="seller-stat-card seller-stat-green">
                    <span className="seller-stat-icon">
                      <CheckCircle2 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Disponibles</span>

                      <strong>{dashboard.nombreAnnoncesDisponibles}</strong>
                    </div>
                  </article>

                  {/* Annonces en création. */}
                  <article className="seller-stat-card seller-stat-gray">
                    <span className="seller-stat-icon">
                      <FilePlus2 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>En création</span>

                      <strong>{dashboard.nombreAnnoncesEnCreation}</strong>
                    </div>
                  </article>

                  {/* Annonces en réexamen. */}
                  <article className="seller-stat-card seller-stat-orange">
                    <span className="seller-stat-icon">
                      <Clock3 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>En réexamen</span>

                      <strong>{dashboard.nombreAnnoncesEnReexamen}</strong>
                    </div>
                  </article>

                  {/* Annonces vendues. */}
                  <article className="seller-stat-card seller-stat-purple">
                    <span className="seller-stat-icon">
                      <ShoppingBag size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Vendues</span>

                      <strong>{dashboard.nombreAnnoncesVendues}</strong>
                    </div>
                  </article>
                </div>
              </section>

              {/* On affiche les statistiques des demandes. */}
              <section className="seller-dashboard-panel">
                {/* On crée l'en-tête de la partie. */}
                <div className="seller-panel-heading">
                  {/* On affiche le titre. */}
                  <div>
                    <span>Suivi des acheteurs</span>

                    <h2>Demandes d’achat reçues</h2>
                  </div>

                  {/* On permet d'accéder aux demandes. */}
                  <Link to="/membre/vendeur/demandes-recues">
                    Voir les demandes

                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>

                {/* On affiche les statistiques. */}
                <div className="seller-stats-grid seller-request-stats">
                  {/* Total des demandes. */}
                  <article className="seller-stat-card seller-stat-blue">
                    <span className="seller-stat-icon">
                      <Inbox size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Total reçues</span>

                      <strong>{dashboard.nombreDemandesRecues}</strong>
                    </div>
                  </article>

                  {/* Demandes en attente. */}
                  <article className="seller-stat-card seller-stat-orange">
                    <span className="seller-stat-icon">
                      <Clock3 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>En attente</span>

                      <strong>{dashboard.nombreDemandesEnAttente}</strong>
                    </div>
                  </article>

                  {/* Demandes acceptées. */}
                  <article className="seller-stat-card seller-stat-green">
                    <span className="seller-stat-icon">
                      <CheckCircle2 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Acceptées</span>

                      <strong>{dashboard.nombreDemandesAcceptees}</strong>
                    </div>
                  </article>
                </div>
              </section>

              {/* On affiche les actions rapides. */}
              <section className="seller-dashboard-panel">
                {/* On crée l'en-tête de la partie. */}
                <div className="seller-panel-heading">
                  <div>
                    <span>Navigation</span>

                    <h2>Actions rapides</h2>
                  </div>
                </div>

                {/* On affiche les actions. */}
                <div className="seller-actions-grid">
                  {/* Action de création d'une annonce. */}
                  <Link
                    className="seller-action-card seller-action-blue"
                    to="/membre/vendeur/annonces/nouvelle"
                  >
                    <span className="seller-action-icon">
                      <FilePlus2 size={27} aria-hidden="true" />
                    </span>

                    <h3>Publier une annonce</h3>

                    <p>
                      Créer une nouvelle annonce avec des photos et une
                      description complète.
                    </p>

                    <span className="seller-action-link">
                      Commencer

                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>

                  {/* Action de consultation des annonces. */}
                  <Link
                    className="seller-action-card seller-action-teal"
                    to="/membre/vendeur/mes-annonces"
                  >
                    <span className="seller-action-icon">
                      <Package size={27} aria-hidden="true" />
                    </span>

                    <h3>Mes annonces</h3>

                    <p>
                      Consulter, modifier ou retirer les annonces déjà
                      publiées.
                    </p>

                    <span className="seller-action-link">
                      Consulter

                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>

                  {/* Action de consultation des demandes. */}
                  <Link
                    className="seller-action-card seller-action-orange"
                    to="/membre/vendeur/demandes-recues"
                  >
                    <span className="seller-action-icon">
                      <Inbox size={27} aria-hidden="true" />
                    </span>

                    <h3>Demandes reçues</h3>

                    <p>
                      Consulter, accepter ou refuser les demandes d’achat
                      reçues.
                    </p>

                    <span className="seller-action-link">
                      Consulter

                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>

                  {/* Action de gestion de l'abonnement. */}
                  <Link
                    className="seller-action-card seller-action-purple"
                    to="/membre/vendeur/abonnement"
                  >
                    <span className="seller-action-icon">
                      <CreditCard size={27} aria-hidden="true" />
                    </span>

                    <h3>Mon abonnement</h3>

                    <p>
                      Consulter votre limite et découvrir les autres offres.
                    </p>

                    <span className="seller-action-link">
                      Gérer mon offre

                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}