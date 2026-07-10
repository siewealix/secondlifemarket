// On importe useEffect pour charger les membres au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données.
import { useState } from "react";

// On importe les fonctions API pour gérer les membres.
import {
  getAdminUtilisateursRequest,
  suspendreUtilisateurRequest,
  reactiverUtilisateurRequest,
} from "../../api/adminUtilisateurApi.js";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le menu latéral admin.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// Page admin pour gérer les membres.
export default function ManageUsersPage() {
  // On récupère le token de l'administrateur connecté.
  const { accessToken } = useAuth();

  // On stocke la liste des membres.
  const [utilisateurs, setUtilisateurs] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke le message de succès.
  const [success, setSuccess] = useState("");

  // On stocke l'action en cours.
  const [processingId, setProcessingId] = useState(null);

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
    return date.toLocaleDateString("fr-FR");
  }

  // Cette fonction charge les membres.
  async function loadUtilisateurs() {
    // On vide l'ancien message d'erreur.
    setError("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les membres.
    try {
      // On appelle l'API React.
      const data = await getAdminUtilisateursRequest(accessToken);

      // On stocke les membres.
      setUtilisateurs(data);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On désactive le chargement.
      setLoading(false);
    }
  }

  // Cette fonction suspend un membre.
  async function handleSuspendreUtilisateur(utilisateur) {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On demande confirmation à l'administrateur.
    const confirmed = window.confirm(
      `Voulez-vous vraiment suspendre le compte de ${utilisateur.prenom} ${utilisateur.nom} ?`
    );

    // On arrête si l'administrateur annule.
    if (!confirmed) {
      return;
    }

    // On indique que cette ligne est en cours de traitement.
    setProcessingId(utilisateur.id);

    // On essaie de suspendre le membre.
    try {
      // On appelle l'API React.
      const utilisateurModifie = await suspendreUtilisateurRequest(utilisateur.id, accessToken);

      // On remplace le membre dans la liste.
      setUtilisateurs((oldUtilisateurs) =>
        oldUtilisateurs.map((item) =>
          item.id === utilisateurModifie.id ? utilisateurModifie : item
        )
      );

      // On affiche un message de succès.
      setSuccess("Le membre a été suspendu avec succès.");
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête le traitement.
      setProcessingId(null);
    }
  }

  // Cette fonction réactive un membre.
  async function handleReactiverUtilisateur(utilisateur) {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On demande confirmation à l'administrateur.
    const confirmed = window.confirm(
      `Voulez-vous vraiment réactiver le compte de ${utilisateur.prenom} ${utilisateur.nom} ?`
    );

    // On arrête si l'administrateur annule.
    if (!confirmed) {
      return;
    }

    // On indique que cette ligne est en cours de traitement.
    setProcessingId(utilisateur.id);

    // On essaie de réactiver le membre.
    try {
      // On appelle l'API React.
      const utilisateurModifie = await reactiverUtilisateurRequest(utilisateur.id, accessToken);

      // On remplace le membre dans la liste.
      setUtilisateurs((oldUtilisateurs) =>
        oldUtilisateurs.map((item) =>
          item.id === utilisateurModifie.id ? utilisateurModifie : item
        )
      );

      // On affiche un message de succès.
      setSuccess("Le membre a été réactivé avec succès.");
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête le traitement.
      setProcessingId(null);
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge les membres.
      loadUtilisateurs();
    }
  }, [accessToken]);

  // On affiche la page.
  return (
    <>
      {/* On affiche la navbar. */}
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
            <h1>Gestion des membres</h1>

            {/* Description de la page. */}
            <p>Consultez, suspendez ou réactivez les comptes des membres.</p>
          </div>

          {/* Message de chargement. */}
          {loading && (
            <p className="page-message">
              Chargement des membres...
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

          {/* Tableau des membres. */}
          {!loading && (
            <section className="admin-users-section">
              {/* Message si aucun membre. */}
              {utilisateurs.length === 0 && (
                <p className="empty-message">
                  Aucun membre trouvé.
                </p>
              )}

              {/* Tableau affiché seulement s'il y a des membres. */}
              {utilisateurs.length > 0 && (
                <div className="admin-table-wrapper">
                  {/* Tableau des utilisateurs. */}
                  <table className="admin-users-table">
                    {/* En-tête du tableau. */}
                    <thead>
                      <tr>
                        <th>Nom complet</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Ville</th>
                        <th>Date création</th>
                        <th>Statut</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    {/* Corps du tableau. */}
                    <tbody>
                      {/* On parcourt les membres. */}
                      {utilisateurs.map((utilisateur) => (
                        <tr key={utilisateur.id}>
                          {/* Nom complet. */}
                          <td>
                            {utilisateur.prenom} {utilisateur.nom}
                          </td>

                          {/* Email. */}
                          <td>{utilisateur.email}</td>

                          {/* Téléphone. */}
                          <td>{utilisateur.telephone || "Non renseigné"}</td>

                          {/* Ville. */}
                          <td>{utilisateur.ville || "Non renseignée"}</td>

                          {/* Date de création. */}
                          <td>{formatDate(utilisateur.dateCreation)}</td>

                          {/* Statut du compte. */}
                          <td>
                            <span
                              className={
                                utilisateur.estActif
                                  ? "user-status user-status-active"
                                  : "user-status user-status-suspended"
                              }
                            >
                              {utilisateur.estActif ? "Actif" : "Suspendu"}
                            </span>
                          </td>

                          {/* Action possible. */}
                          <td>
                            {utilisateur.estActif ? (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleSuspendreUtilisateur(utilisateur)}
                                disabled={processingId === utilisateur.id}
                              >
                                {processingId === utilisateur.id ? "Traitement..." : "Suspendre"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => handleReactiverUtilisateur(utilisateur)}
                                disabled={processingId === utilisateur.id}
                              >
                                {processingId === utilisateur.id ? "Traitement..." : "Réactiver"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </section>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}