// On importe les hooks React.
import {
  useCallback,
  useEffect,
  useState,
} from "react";

// On importe Link pour les actions rapides.
import { Link } from "react-router-dom";

// On importe les icônes utilisées dans le tableau de bord.
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleAlert,
  Clock3,
  CreditCard,
  FileCheck2,
  FileClock,
  Flag,
  LayoutDashboard,
  LoaderCircle,
  Package,
  RefreshCw,
  Tags,
  UserCheck,
  UserRound,
  UserX,
  Users,
  XCircle,
} from "lucide-react";

// On importe le menu latéral administrateur.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction API du tableau de bord.
import { getAdminDashboardRequest } from "../../api/tableauBordApi.js";

// Ce petit composant affiche un chiffre important.
function AdminOverviewCard({
  Icon,
  label,
  value,
  tone,
}) {
  // On retourne la carte.
  return (
    <article
      className={`admin-overview-card tone-${tone}`}
    >
      {/* On affiche l'icône. */}
      <span className="admin-overview-icon">
        <Icon size={23} aria-hidden="true" />
      </span>

      {/* On affiche le libellé et la valeur. */}
      <div>
        <span className="admin-overview-label">
          {label}
        </span>

        <strong className="admin-overview-value">
          {value}
        </strong>
      </div>
    </article>
  );
}

// Ce petit composant affiche une statistique.
function AdminStatCard({
  Icon,
  label,
  value,
  tone = "blue",
}) {
  // On retourne la carte statistique.
  return (
    <article className="admin-stat-card">
      {/* On affiche l'icône. */}
      <span
        className={`admin-stat-icon tone-${tone}`}
      >
        <Icon size={19} aria-hidden="true" />
      </span>

      {/* On affiche le libellé. */}
      <span className="admin-stat-label">
        {label}
      </span>

      {/* On affiche la valeur réelle. */}
      <strong className="admin-stat-value">
        {value}
      </strong>
    </article>
  );
}

// Ce composant affiche une action rapide.
function AdminActionCard({
  to,
  Icon,
  title,
  description,
  badge,
}) {
  // On retourne le lien.
  return (
    <Link className="admin-action-card" to={to}>
      {/* On affiche l'icône. */}
      <span className="admin-action-icon">
        <Icon size={23} aria-hidden="true" />
      </span>

      {/* On affiche le contenu. */}
      <div className="admin-action-content">
        <div className="admin-action-title">
          <h3>{title}</h3>

          {/* On affiche le badge lorsqu'une valeur existe. */}
          {badge !== undefined && badge !== null && (
            <span className="admin-action-badge">
              {badge}
            </span>
          )}
        </div>

        <p>{description}</p>
      </div>

      {/* On affiche la flèche. */}
      <ArrowRight
        className="admin-action-arrow"
        size={20}
        aria-hidden="true"
      />
    </Link>
  );
}

// On crée la page du tableau de bord administrateur.
export default function AdminDashboardPage() {
  // On récupère le token et l'administrateur connecté.
  const { accessToken, user } = useAuth();

  // On mémorise les statistiques du backend.
  const [dashboard, setDashboard] = useState(null);

  // On mémorise l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On mémorise le message d'erreur.
  const [error, setError] = useState("");

  // On crée le nom complet de l'administrateur.
  const adminName =
    `${user?.prenom || ""} ${user?.nom || ""}`.trim() ||
    "Administrateur";

  // On crée la date actuelle en français.
  const currentDate = new Date().toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // Cette fonction charge les statistiques.
  const loadDashboard = useCallback(async () => {
    // On efface l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de récupérer les données.
    try {
      // On appelle le backend.
      const data =
        await getAdminDashboardRequest(accessToken);

      // On mémorise les données reçues.
      setDashboard(data);
    } catch (error) {
      // On affiche une erreur claire.
      setError(
        error.message ||
          "Impossible de charger le tableau de bord administrateur."
      );
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }, [accessToken]);

  // Ce bloc se lance lorsque le token est disponible.
  useEffect(() => {
    // On vérifie que le token existe.
    if (accessToken) {
      // On charge les données.
      loadDashboard();
    }
  }, [accessToken, loadDashboard]);

  // On retourne la page.
  return (
    <main className="admin-layout-page">
      {/* On affiche la sidebar. */}
      <AdminSidebar />

      {/* On affiche le contenu principal. */}
      <section className="admin-content-page">
        {/* On affiche le grand en-tête. */}
        <header className="admin-dashboard-hero">
          {/* On affiche le texte principal. */}
          <div className="admin-dashboard-hero-main">
            {/* On affiche le petit titre. */}
            <span className="admin-dashboard-kicker">
              <LayoutDashboard
                size={17}
                aria-hidden="true"
              />
              Centre de contrôle
            </span>

            {/* On affiche le titre. */}
            <h1>Tableau de bord administrateur</h1>

            {/* On affiche le nom de l'administrateur. */}
            <p>
              Bonjour <strong>{adminName}</strong>, voici
              l’activité générale de SecondLife Market.
            </p>

            {/* On affiche la date actuelle. */}
            <div className="admin-dashboard-date">
              <CalendarDays
                size={17}
                aria-hidden="true"
              />

              <span>{currentDate}</span>
            </div>
          </div>

          {/* On affiche le nombre de signalements à traiter. */}
          <div className="admin-dashboard-alert-card">
            <span>À traiter</span>

            <strong>
              {loading
                ? "—"
                : dashboard?.nombreTotalSignalementsEnAttente ??
                  0}
            </strong>

            <small>signalements en attente</small>
          </div>
        </header>

        {/* On affiche le chargement. */}
        {loading && (
          <section
            className="admin-dashboard-loading"
            aria-live="polite"
          >
            <LoaderCircle
              className="admin-dashboard-spinner"
              size={38}
              aria-hidden="true"
            />

            <h2>Chargement du tableau de bord</h2>

            <p>
              Nous récupérons les statistiques de la
              plateforme.
            </p>
          </section>
        )}

        {/* On affiche l'erreur. */}
        {error && (
          <section
            className="admin-dashboard-error"
            role="alert"
          >
            <CircleAlert size={25} aria-hidden="true" />

            <div>
              <strong>
                Impossible de charger les données
              </strong>

              <p>{error}</p>
            </div>

            {/* On permet de réessayer. */}
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
            >
              <RefreshCw size={17} aria-hidden="true" />
              Réessayer
            </button>
          </section>
        )}

        {/* On affiche les données réelles. */}
        {!loading && dashboard && (
          <>
            {/* On affiche le message général du backend. */}
            <section className="admin-platform-message">
              <div className="admin-platform-message-main">
                {/* On affiche l'icône. */}
                <span className="admin-platform-icon">
                  <Activity size={23} aria-hidden="true" />
                </span>

                {/* On affiche le message. */}
                <div>
                  <span>Résumé de la plateforme</span>
                  <p>{dashboard.message}</p>
                </div>
              </div>

              {/* On affiche un lien si des signalements attendent. */}
              {dashboard.nombreTotalSignalementsEnAttente >
              0 ? (
                <Link
                  className="admin-platform-link"
                  to="/admin/signalements"
                >
                  Traiter les signalements
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <span className="admin-platform-ok">
                  <BadgeCheck
                    size={18}
                    aria-hidden="true"
                  />
                  Aucun signalement en attente
                </span>
              )}
            </section>

            {/* On affiche les quatre chiffres principaux. */}
            <section
              className="admin-overview-grid"
              aria-label="Résumé des statistiques"
            >
              <AdminOverviewCard
                Icon={Users}
                label="Membres"
                value={dashboard.nombreTotalMembres}
                tone="blue"
              />

              <AdminOverviewCard
                Icon={Package}
                label="Annonces"
                value={dashboard.nombreTotalAnnonces}
                tone="cyan"
              />

              <AdminOverviewCard
                Icon={FileCheck2}
                label="Demandes d'achat"
                value={
                  dashboard.nombreTotalDemandesAchat
                }
                tone="purple"
              />

              <AdminOverviewCard
                Icon={Flag}
                label="Signalements en attente"
                value={
                  dashboard.nombreTotalSignalementsEnAttente
                }
                tone="orange"
              />
            </section>

            {/* On organise membres et abonnements en colonnes. */}
            <div className="admin-dashboard-two-columns">
              {/* Section des membres. */}
              <section className="admin-dashboard-section">
                <div className="admin-dashboard-section-heading">
                  <div className="admin-dashboard-section-title">
                    <span className="admin-dashboard-section-icon">
                      <Users size={21} aria-hidden="true" />
                    </span>

                    <div>
                      <h2>Membres</h2>
                      <p>État des comptes de la plateforme.</p>
                    </div>
                  </div>

                  <Link
                    className="admin-dashboard-section-link"
                    to="/admin/utilisateurs"
                  >
                    Gérer
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <div className="admin-stats-grid">
                  <AdminStatCard
                    Icon={UserRound}
                    label="Total"
                    value={dashboard.nombreTotalMembres}
                    tone="blue"
                  />

                  <AdminStatCard
                    Icon={UserCheck}
                    label="Actifs"
                    value={dashboard.nombreMembresActifs}
                    tone="green"
                  />

                  <AdminStatCard
                    Icon={UserX}
                    label="Suspendus"
                    value={
                      dashboard.nombreMembresSuspendus
                    }
                    tone="red"
                  />
                </div>
              </section>

              {/* Section des abonnements. */}
              <section className="admin-dashboard-section">
                <div className="admin-dashboard-section-heading">
                  <div className="admin-dashboard-section-title">
                    <span className="admin-dashboard-section-icon">
                      <CreditCard
                        size={21}
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <h2>Abonnements</h2>
                      <p>Suivi des offres vendeurs.</p>
                    </div>
                  </div>

                  <Link
                    className="admin-dashboard-section-link"
                    to="/admin/abonnements"
                  >
                    Gérer
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <div className="admin-stats-grid">
                  <AdminStatCard
                    Icon={CreditCard}
                    label="Total"
                    value={
                      dashboard.nombreTotalAbonnements
                    }
                    tone="blue"
                  />

                  <AdminStatCard
                    Icon={BadgeCheck}
                    label="Actifs"
                    value={
                      dashboard.nombreAbonnementsActifs
                    }
                    tone="green"
                  />

                  <AdminStatCard
                    Icon={Clock3}
                    label="Expirés"
                    value={
                      dashboard.nombreAbonnementsExpires
                    }
                    tone="orange"
                  />
                </div>
              </section>
            </div>

            {/* Section des annonces. */}
            <section className="admin-dashboard-section">
              <div className="admin-dashboard-section-heading">
                <div className="admin-dashboard-section-title">
                  <span className="admin-dashboard-section-icon">
                    <Package size={21} aria-hidden="true" />
                  </span>

                  <div>
                    <h2>Annonces</h2>
                    <p>
                      Répartition actuelle des annonces.
                    </p>
                  </div>
                </div>

                <Link
                  className="admin-dashboard-section-link"
                  to="/admin/reexamens"
                >
                  Voir les réexamens
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <div className="admin-stats-grid admin-stats-grid-large">
                <AdminStatCard
                  Icon={Package}
                  label="Total"
                  value={dashboard.nombreTotalAnnonces}
                  tone="blue"
                />

                <AdminStatCard
                  Icon={BadgeCheck}
                  label="Disponibles"
                  value={
                    dashboard.nombreAnnoncesDisponibles
                  }
                  tone="green"
                />

                <AdminStatCard
                  Icon={FileClock}
                  label="En création"
                  value={
                    dashboard.nombreAnnoncesEnCreation
                  }
                  tone="cyan"
                />

                <AdminStatCard
                  Icon={Clock3}
                  label="En réexamen"
                  value={
                    dashboard.nombreAnnoncesEnReexamen
                  }
                  tone="orange"
                />

                <AdminStatCard
                  Icon={XCircle}
                  label="Rejetées"
                  value={
                    dashboard.nombreAnnoncesRejetees
                  }
                  tone="red"
                />

                <AdminStatCard
                  Icon={FileCheck2}
                  label="Vendues"
                  value={dashboard.nombreAnnoncesVendues}
                  tone="purple"
                />
              </div>
            </section>

            {/* On organise demandes et signalements. */}
            <div className="admin-dashboard-two-columns">
              {/* Section des demandes d'achat. */}
              <section className="admin-dashboard-section">
                <div className="admin-dashboard-section-heading">
                  <div className="admin-dashboard-section-title">
                    <span className="admin-dashboard-section-icon">
                      <FileCheck2
                        size={21}
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <h2>Demandes d’achat</h2>
                      <p>État des demandes envoyées.</p>
                    </div>
                  </div>
                </div>

                <div className="admin-stats-grid">
                  <AdminStatCard
                    Icon={FileCheck2}
                    label="Total"
                    value={
                      dashboard.nombreTotalDemandesAchat
                    }
                    tone="blue"
                  />

                  <AdminStatCard
                    Icon={Clock3}
                    label="En attente"
                    value={
                      dashboard.nombreDemandesEnAttente
                    }
                    tone="orange"
                  />

                  <AdminStatCard
                    Icon={BadgeCheck}
                    label="Acceptées"
                    value={
                      dashboard.nombreDemandesAcceptees
                    }
                    tone="green"
                  />

                  <AdminStatCard
                    Icon={XCircle}
                    label="Refusées"
                    value={
                      dashboard.nombreDemandesRefusees
                    }
                    tone="red"
                  />
                </div>
              </section>

              {/* Section des signalements. */}
              <section className="admin-dashboard-section">
                <div className="admin-dashboard-section-heading">
                  <div className="admin-dashboard-section-title">
                    <span className="admin-dashboard-section-icon">
                      <Flag size={21} aria-hidden="true" />
                    </span>

                    <div>
                      <h2>Signalements</h2>
                      <p>Éléments encore à traiter.</p>
                    </div>
                  </div>

                  <Link
                    className="admin-dashboard-section-link"
                    to="/admin/signalements"
                  >
                    Traiter
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <div className="admin-stats-grid">
                  <AdminStatCard
                    Icon={Flag}
                    label="Annonces"
                    value={
                      dashboard.nombreSignalementsAnnoncesEnAttente
                    }
                    tone="orange"
                  />

                  <AdminStatCard
                    Icon={UserRound}
                    label="Utilisateurs"
                    value={
                      dashboard.nombreSignalementsUtilisateursEnAttente
                    }
                    tone="red"
                  />

                  <AdminStatCard
                    Icon={CircleAlert}
                    label="Total"
                    value={
                      dashboard.nombreTotalSignalementsEnAttente
                    }
                    tone="purple"
                  />
                </div>
              </section>
            </div>

            {/* Section des actions rapides. */}
            <section className="admin-dashboard-actions-section">
              <div className="admin-dashboard-actions-heading">
                <span>Navigation rapide</span>
                <h2>Actions administrateur</h2>
                <p>
                  Accédez rapidement aux principales fonctions
                  d’administration.
                </p>
              </div>

              <div className="admin-actions-grid">
                <AdminActionCard
                  to="/admin/reexamens"
                  Icon={FileCheck2}
                  title="Réexamens IA"
                  description="Valider ou rejeter les annonces envoyées en vérification."
                  badge={
                    dashboard.nombreAnnoncesEnReexamen
                  }
                />

                <AdminActionCard
                  to="/admin/signalements"
                  Icon={Flag}
                  title="Signalements"
                  description="Traiter les signalements concernant les annonces et les membres."
                  badge={
                    dashboard.nombreTotalSignalementsEnAttente
                  }
                />

                <AdminActionCard
                  to="/admin/utilisateurs"
                  Icon={Users}
                  title="Membres"
                  description="Suspendre ou réactiver les comptes des membres."
                />

                <AdminActionCard
                  to="/admin/categories"
                  Icon={Tags}
                  title="Catégories"
                  description="Ajouter, modifier ou désactiver les catégories."
                />

                <AdminActionCard
                  to="/admin/abonnements"
                  Icon={CreditCard}
                  title="Abonnements"
                  description="Gérer les offres et consulter les abonnements."
                  badge={
                    dashboard.nombreAbonnementsActifs
                  }
                />
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}