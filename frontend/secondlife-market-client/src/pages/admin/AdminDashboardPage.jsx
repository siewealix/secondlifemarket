// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe Link pour créer des liens internes.
import { Link } from "react-router-dom";

// On importe le menu latéral administrateur.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la fonction API du tableau de bord admin.
import { getAdminDashboardRequest } from "../../api/tableauBordApi.js";

// Page du tableau de bord administrateur.
export default function AdminDashboardPage() {
  // On récupère le token de l'administrateur connecté.
  const { accessToken } = useAuth();

  // On stocke les statistiques admin.
  const [dashboard, setDashboard] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // Cette fonction charge les statistiques administrateur.
  async function loadDashboard() {
    // On vide l'ancienne erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les données.
    try {
      // On appelle le backend.
      const data = await getAdminDashboardRequest(accessToken);

      // On stocke les statistiques.
      setDashboard(data);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge le tableau de bord.
      loadDashboard();
    }
  }, [accessToken]);

  // On retourne l'interface.
  return (
    <main className="admin-layout-page">
      {/* Menu latéral administrateur. */}
      <AdminSidebar />

      {/* Contenu principal administrateur. */}
      <section className="admin-content-page">
        {/* En-tête. */}
        <div className="admin-page-header">
          <div>
            <span className="section-kicker">Administration</span>
            <h1>Tableau de bord administrateur</h1>
            <p>Suivez l'activité générale de la plateforme SecondLife Market.</p>
          </div>
        </div>

        {/* Message de chargement. */}
        {loading && (
          <p className="page-message">
            Chargement du tableau de bord administrateur...
          </p>
        )}

        {/* Message d'erreur. */}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {/* Contenu du tableau de bord. */}
        {!loading && dashboard && (
          <>
            {/* Message général. */}
            <section className="admin-summary-card">
              <h2>Résumé général</h2>
              <p>{dashboard.message}</p>

              <div className="admin-summary-grid">
                <div className="admin-summary-item">
                  <span>Membres</span>
                  <strong>{dashboard.nombreTotalMembres}</strong>
                </div>

                <div className="admin-summary-item">
                  <span>Annonces</span>
                  <strong>{dashboard.nombreTotalAnnonces}</strong>
                </div>

                <div className="admin-summary-item">
                  <span>Demandes d'achat</span>
                  <strong>{dashboard.nombreTotalDemandesAchat}</strong>
                </div>

                <div className="admin-summary-item">
                  <span>Signalements en attente</span>
                  <strong>{dashboard.nombreTotalSignalementsEnAttente}</strong>
                </div>
              </div>
            </section>

            {/* Statistiques membres. */}
            <section className="dashboard-section">
              <h2>Membres</h2>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span>Total membres</span>
                  <strong>{dashboard.nombreTotalMembres}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Membres actifs</span>
                  <strong>{dashboard.nombreMembresActifs}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Membres suspendus</span>
                  <strong>{dashboard.nombreMembresSuspendus}</strong>
                </div>
              </div>
            </section>

            {/* Statistiques annonces. */}
            <section className="dashboard-section">
              <h2>Annonces</h2>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span>Total annonces</span>
                  <strong>{dashboard.nombreTotalAnnonces}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Disponibles</span>
                  <strong>{dashboard.nombreAnnoncesDisponibles}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>En création</span>
                  <strong>{dashboard.nombreAnnoncesEnCreation}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>En réexamen</span>
                  <strong>{dashboard.nombreAnnoncesEnReexamen}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Rejetées</span>
                  <strong>{dashboard.nombreAnnoncesRejetees}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Vendues</span>
                  <strong>{dashboard.nombreAnnoncesVendues}</strong>
                </div>
              </div>
            </section>

            {/* Statistiques demandes. */}
            <section className="dashboard-section">
              <h2>Demandes d'achat</h2>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span>Total demandes</span>
                  <strong>{dashboard.nombreTotalDemandesAchat}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>En attente</span>
                  <strong>{dashboard.nombreDemandesEnAttente}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Acceptées</span>
                  <strong>{dashboard.nombreDemandesAcceptees}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Refusées</span>
                  <strong>{dashboard.nombreDemandesRefusees}</strong>
                </div>
              </div>
            </section>

            {/* Statistiques signalements. */}
            <section className="dashboard-section">
              <h2>Signalements</h2>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span>Signalements annonces</span>
                  <strong>{dashboard.nombreSignalementsAnnoncesEnAttente}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Signalements utilisateurs</span>
                  <strong>{dashboard.nombreSignalementsUtilisateursEnAttente}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Total en attente</span>
                  <strong>{dashboard.nombreTotalSignalementsEnAttente}</strong>
                </div>
              </div>
            </section>

            {/* Statistiques abonnements. */}
            <section className="dashboard-section">
              <h2>Abonnements</h2>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span>Total abonnements</span>
                  <strong>{dashboard.nombreTotalAbonnements}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Abonnements actifs</span>
                  <strong>{dashboard.nombreAbonnementsActifs}</strong>
                </div>

                <div className="admin-stat-card">
                  <span>Abonnements expirés</span>
                  <strong>{dashboard.nombreAbonnementsExpires}</strong>
                </div>
              </div>
            </section>

            {/* Actions rapides. */}
            <section className="dashboard-section">
              <h2>Actions rapides</h2>

              <div className="admin-actions-grid">
                <Link className="admin-action-card" to="/admin/annonces-reexamen">
                  <span>🧾</span>
                  <h3>Annonces à réexaminer</h3>
                  <p>Valider ou rejeter les annonces envoyées en vérification.</p>
                </Link>

                <Link className="admin-action-card" to="/admin/signalements">
                  <span>🚩</span>
                  <h3>Signalements</h3>
                  <p>Traiter les signalements d'annonces et d'utilisateurs.</p>
                </Link>

                <Link className="admin-action-card" to="/admin/utilisateurs">
                  <span>👥</span>
                  <h3>Membres</h3>
                  <p>Suspendre ou réactiver les comptes membres.</p>
                </Link>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}