// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données.
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
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  XCircle,
} from "lucide-react";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction API du tableau de bord acheteur.
import { getAcheteurDashboardRequest } from "../../api/tableauBordApi.js";

// On crée la page du tableau de bord acheteur.
export default function BuyerDashboardPage() {
  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On stocke les statistiques de l'acheteur.
  const [dashboard, setDashboard] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // Cette fonction charge les statistiques de l'acheteur.
  async function loadDashboard() {
    // On vide l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    try {
      // On appelle le backend.
      const data = await getAcheteurDashboardRequest(accessToken);

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

  // On retourne l'interface.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="page-section buyer-dashboard-page">
        {/* On centre le contenu. */}
        <div className="container buyer-dashboard-container">
          {/* On crée le bandeau principal. */}
          <header className="buyer-dashboard-header">
            {/* On crée la partie gauche du bandeau. */}
            <div className="buyer-dashboard-header-content">
              {/* On permet de retourner à l'espace membre. */}
              <Link
                className="buyer-dashboard-back"
                to="/membre"
              >
                <ArrowLeft size={18} aria-hidden="true" />

                Retour à l’espace membre
              </Link>

              {/* On affiche le type d'espace. */}
              <span className="buyer-dashboard-label">
                <LayoutDashboard size={17} aria-hidden="true" />

                Espace achat
              </span>

              {/* On affiche le titre principal. */}
              <h1>Tableau de bord acheteur</h1>

              {/* On présente le tableau de bord. */}
              <p>
                Suivez vos demandes d’achat, consultez vos conversations et
                découvrez les objets actuellement disponibles.
              </p>
            </div>

            {/* On affiche l'action principale. */}
            <Link
              className="buyer-dashboard-primary-action"
              to="/annonces"
            >
              <Search size={20} aria-hidden="true" />

              Découvrir les annonces
            </Link>
          </header>

          {/* On affiche le chargement. */}
          {loading && (
            <div
              className="buyer-dashboard-loading"
              role="status"
            >
              {/* On affiche une icône animée. */}
              <LoaderCircle
                className="buyer-loading-icon"
                size={34}
                aria-hidden="true"
              />

              {/* On affiche le message de chargement. */}
              <div>
                <strong>Chargement en cours</strong>

                <p>Nous préparons votre tableau de bord acheteur.</p>
              </div>
            </div>
          )}

          {/* On affiche l'erreur. */}
          {!loading && error && (
            <div
              className="buyer-dashboard-error"
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
                  className="buyer-retry-button"
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
              {/* On affiche le résumé principal. */}
              <section className="buyer-summary-card">
                {/* On crée l'en-tête du résumé. */}
                <div className="buyer-summary-header">
                  {/* On affiche l'icône principale. */}
                  <span
                    className="buyer-summary-main-icon"
                    aria-hidden="true"
                  >
                    <ShoppingCart size={31} />
                  </span>

                  {/* On affiche le titre et le message. */}
                  <div>
                    <span>Vue générale</span>

                    <h2>Résumé de mon activité</h2>

                    <p>{dashboard.message}</p>
                  </div>
                </div>

                {/* On affiche les informations principales. */}
                <div className="buyer-summary-grid">
                  {/* On affiche les demandes envoyées. */}
                  <article className="buyer-summary-item buyer-summary-orange">
                    {/* On affiche l'icône. */}
                    <span className="buyer-summary-icon">
                      <Send size={25} aria-hidden="true" />
                    </span>

                    {/* On affiche la donnée. */}
                    <div>
                      <span>Demandes envoyées</span>

                      <strong>{dashboard.nombreDemandesEnvoyees}</strong>
                    </div>
                  </article>

                  {/* On affiche les conversations. */}
                  <article className="buyer-summary-item buyer-summary-purple">
                    {/* On affiche l'icône. */}
                    <span className="buyer-summary-icon">
                      <MessageCircle size={25} aria-hidden="true" />
                    </span>

                    {/* On affiche la donnée. */}
                    <div>
                      <span>Conversations</span>

                      <strong>{dashboard.nombreConversations}</strong>
                    </div>
                  </article>

                  {/* On affiche les annonces disponibles. */}
                  <article className="buyer-summary-item buyer-summary-blue">
                    {/* On affiche l'icône. */}
                    <span className="buyer-summary-icon">
                      <ShoppingBag size={25} aria-hidden="true" />
                    </span>

                    {/* On affiche la donnée. */}
                    <div>
                      <span>Annonces disponibles</span>

                      <strong>{dashboard.nombreAnnoncesDisponibles}</strong>
                    </div>
                  </article>
                </div>
              </section>

              {/* On affiche les statistiques des demandes. */}
              <section className="buyer-dashboard-panel">
                {/* On crée l'en-tête de la partie. */}
                <div className="buyer-panel-heading">
                  {/* On affiche le titre. */}
                  <div>
                    <span>Suivi de mon activité</span>

                    <h2>Mes demandes d’achat</h2>
                  </div>

                  {/* On permet d'accéder aux demandes. */}
                  <Link to="/membre/acheteur/mes-demandes">
                    Voir mes demandes

                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>

                {/* On affiche les statistiques. */}
                <div className="buyer-stats-grid">
                  {/* Total des demandes envoyées. */}
                  <article className="buyer-stat-card buyer-stat-blue">
                    <span className="buyer-stat-icon">
                      <Inbox size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Total envoyées</span>

                      <strong>{dashboard.nombreDemandesEnvoyees}</strong>
                    </div>
                  </article>

                  {/* Demandes en attente. */}
                  <article className="buyer-stat-card buyer-stat-orange">
                    <span className="buyer-stat-icon">
                      <Clock3 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>En attente</span>

                      <strong>{dashboard.nombreDemandesEnAttente}</strong>
                    </div>
                  </article>

                  {/* Demandes acceptées. */}
                  <article className="buyer-stat-card buyer-stat-green">
                    <span className="buyer-stat-icon">
                      <CheckCircle2 size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Acceptées</span>

                      <strong>{dashboard.nombreDemandesAcceptees}</strong>
                    </div>
                  </article>

                  {/* Demandes refusées. */}
                  <article className="buyer-stat-card buyer-stat-red">
                    <span className="buyer-stat-icon">
                      <XCircle size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Refusées</span>

                      <strong>{dashboard.nombreDemandesRefusees}</strong>
                    </div>
                  </article>

                  {/* Demandes annulées. */}
                  <article className="buyer-stat-card buyer-stat-gray">
                    <span className="buyer-stat-icon">
                      <RotateCcw size={25} aria-hidden="true" />
                    </span>

                    <div>
                      <span>Annulées</span>

                      <strong>{dashboard.nombreDemandesAnnulees}</strong>
                    </div>
                  </article>
                </div>
              </section>

              {/* On affiche les actions rapides. */}
              <section className="buyer-dashboard-panel">
                {/* On crée l'en-tête de la partie. */}
                <div className="buyer-panel-heading">
                  {/* On affiche le titre. */}
                  <div>
                    <span>Navigation</span>

                    <h2>Actions rapides</h2>
                  </div>
                </div>

                {/* On affiche les différentes actions. */}
                <div className="buyer-actions-grid">
                  {/* On permet de consulter les annonces. */}
                  <Link
                    className="buyer-action-card buyer-action-orange"
                    to="/annonces"
                  >
                    {/* On affiche l'icône. */}
                    <span className="buyer-action-icon">
                      <Search size={28} aria-hidden="true" />
                    </span>

                    {/* On affiche le titre. */}
                    <h3>Voir les annonces</h3>

                    {/* On affiche la description. */}
                    <p>
                      Rechercher et découvrir les objets actuellement
                      disponibles sur la plateforme.
                    </p>

                    {/* On affiche l'action. */}
                    <span className="buyer-action-link">
                      Rechercher un objet

                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>

                  {/* On permet de consulter les demandes. */}
                  <Link
                    className="buyer-action-card buyer-action-purple"
                    to="/membre/acheteur/mes-demandes"
                  >
                    {/* On affiche l'icône. */}
                    <span className="buyer-action-icon">
                      <Inbox size={28} aria-hidden="true" />
                    </span>

                    {/* On affiche le titre. */}
                    <h3>Mes demandes d’achat</h3>

                    {/* On affiche la description. */}
                    <p>
                      Consulter, suivre ou annuler les demandes d’achat déjà
                      envoyées.
                    </p>

                    {/* On affiche l'action. */}
                    <span className="buyer-action-link">
                      Voir mes demandes

                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>

                  {/* On permet de retourner à l'espace membre. */}
                  <Link
                    className="buyer-action-card buyer-action-blue"
                    to="/membre"
                  >
                    {/* On affiche l'icône. */}
                    <span className="buyer-action-icon">
                      <UserRound size={28} aria-hidden="true" />
                    </span>

                    {/* On affiche le titre. */}
                    <h3>Espace membre</h3>

                    {/* On affiche la description. */}
                    <p>
                      Retourner à votre espace principal pour accéder aux autres
                      fonctionnalités.
                    </p>

                    {/* On affiche l'action. */}
                    <span className="buyer-action-link">
                      Retour à mon espace

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