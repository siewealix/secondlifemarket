// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe le menu latéral administrateur.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe les fonctions API.
import {
  activerAdminTypeAbonnementRequest,
  createAdminTypeAbonnementRequest,
  desactiverAdminTypeAbonnementRequest,
  getAdminAbonnementsRequest,
  getAdminTypesAbonnementRequest,
  updateAdminTypeAbonnementRequest,
} from "../../api/adminAbonnementApi.js";

// Page admin de gestion des abonnements.
export default function ManageSubscriptionsPage() {
  // On récupère le token de l'administrateur connecté.
  const { accessToken } = useAuth();

  // On stocke les abonnements souscrits par les membres.
  const [abonnements, setAbonnements] = useState([]);

  // On stocke les types d'abonnement.
  const [typesAbonnement, setTypesAbonnement] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke le message de succès.
  const [success, setSuccess] = useState("");

  // On stocke l'identifiant du type en modification.
  const [editingTypeId, setEditingTypeId] = useState(null);

  // On stocke l'identifiant du type en cours d'action.
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // On stocke les données du formulaire.
  const [formData, setFormData] = useState({
    // Nom de l'offre.
    nom: "",

    // Description de l'offre.
    description: "",

    // Prix de l'offre.
    prix: "",

    // Durée de l'offre en jours.
    dureeJours: "",

    // Limite de publication.
    limitePublication: "",
  });

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

    // On retourne une date française.
    return date.toLocaleDateString("fr-FR");
  }

  // Cette fonction charge les abonnements et les types.
  async function loadData() {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On active le chargement.
    setLoading(true);

    // On essaie de charger les données.
    try {
      // On charge les abonnements des membres.
      const abonnementsData = await getAdminAbonnementsRequest(accessToken);

      // On charge les types d'abonnement.
      const typesData = await getAdminTypesAbonnementRequest(accessToken);

      // On stocke les abonnements.
      setAbonnements(abonnementsData);

      // On stocke les types.
      setTypesAbonnement(typesData);
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête le chargement.
      setLoading(false);
    }
  }

  // Cette fonction met à jour les champs du formulaire.
  function handleChange(event) {
    // On récupère le nom du champ.
    const name = event.target.name;

    // On récupère la valeur du champ.
    const value = event.target.value;

    // On met à jour le formulaire.
    setFormData((currentData) => ({
      // On garde les anciennes valeurs.
      ...currentData,

      // On modifie le champ concerné.
      [name]: value,
    }));
  }

  // Cette fonction vide le formulaire.
  function resetForm() {
    // On annule le mode modification.
    setEditingTypeId(null);

    // On vide les champs.
    setFormData({
      // Nom vide.
      nom: "",

      // Description vide.
      description: "",

      // Prix vide.
      prix: "",

      // Durée vide.
      dureeJours: "",

      // Limite vide.
      limitePublication: "",
    });
  }

  // Cette fonction prépare la modification d'un type.
  function handleEdit(type) {
    // On met l'identifiant du type en modification.
    setEditingTypeId(type.id);

    // On remplit le formulaire avec les données existantes.
    setFormData({
      // Nom actuel.
      nom: type.nom,

      // Description actuelle.
      description: type.description,

      // Prix actuel.
      prix: String(type.prix),

      // Durée actuelle.
      dureeJours: String(type.dureeJours),

      // Limite actuelle.
      limitePublication: String(type.limitePublication),
    });

    // On vide les anciens messages.
    setError("");
    setSuccess("");
  }

  // Cette fonction envoie le formulaire.
  async function handleSubmit(event) {
    // On empêche le rechargement de la page.
    event.preventDefault();

    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On prépare les données à envoyer au backend.
    const payload = {
      // Nom nettoyé.
      nom: formData.nom.trim(),

      // Description nettoyée.
      description: formData.description.trim(),

      // Prix converti en nombre.
      prix: Number(formData.prix),

      // Durée convertie en nombre entier.
      dureeJours: Number(formData.dureeJours),

      // Limite convertie en nombre entier.
      limitePublication: Number(formData.limitePublication),
    };

    // On vérifie le nom.
    if (!payload.nom) {
      // On affiche une erreur.
      setError("Le nom du type d'abonnement est obligatoire.");

      // On arrête.
      return;
    }

    // On vérifie la description.
    if (!payload.description) {
      // On affiche une erreur.
      setError("La description est obligatoire.");

      // On arrête.
      return;
    }

    // On vérifie le prix.
    if (payload.prix < 0) {
      // On affiche une erreur.
      setError("Le prix ne peut pas être négatif.");

      // On arrête.
      return;
    }

    // On vérifie la durée.
    if (payload.dureeJours <= 0) {
      // On affiche une erreur.
      setError("La durée doit être supérieure à 0.");

      // On arrête.
      return;
    }

    // On vérifie la limite.
    if (payload.limitePublication <= 0) {
      // On affiche une erreur.
      setError("La limite de publication doit être supérieure à 0.");

      // On arrête.
      return;
    }

    // On essaie d'ajouter ou de modifier.
    try {
      // Si un type est en modification.
      if (editingTypeId) {
        // On modifie le type.
        const updatedType = await updateAdminTypeAbonnementRequest(
          editingTypeId,
          payload,
          accessToken
        );

        // On met à jour la liste localement.
        setTypesAbonnement((currentTypes) =>
          currentTypes.map((type) =>
            type.id === editingTypeId ? updatedType : type
          )
        );

        // On affiche un message de succès.
        setSuccess("Le type d'abonnement a été modifié avec succès.");
      } else {
        // On crée un nouveau type.
        const createdType = await createAdminTypeAbonnementRequest(payload, accessToken);

        // On ajoute le nouveau type dans la liste.
        setTypesAbonnement((currentTypes) => [...currentTypes, createdType]);

        // On affiche un message de succès.
        setSuccess("Le type d'abonnement a été ajouté avec succès.");
      }

      // On vide le formulaire.
      resetForm();
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    }
  }

  // Cette fonction active ou désactive un type.
  async function handleToggleStatus(type) {
    // On vide les anciens messages.
    setError("");
    setSuccess("");

    // On prépare le message de confirmation.
    const message = type.estActif
      ? "Voulez-vous vraiment désactiver ce type d'abonnement ?"
      : "Voulez-vous vraiment activer ce type d'abonnement ?";

    // On demande confirmation.
    const confirmed = window.confirm(message);

    // Si l'admin annule.
    if (!confirmed) {
      // On arrête.
      return;
    }

    // On indique que ce type est en traitement.
    setActionLoadingId(type.id);

    // On essaie d'activer ou désactiver.
    try {
      // On prépare une variable pour le résultat.
      let updatedType;

      // Si le type est actif, on le désactive.
      if (type.estActif) {
        // On appelle l'API de désactivation.
        updatedType = await desactiverAdminTypeAbonnementRequest(type.id, accessToken);
      } else {
        // On appelle l'API d'activation.
        updatedType = await activerAdminTypeAbonnementRequest(type.id, accessToken);
      }

      // On met à jour la liste localement.
      setTypesAbonnement((currentTypes) =>
        currentTypes.map((currentType) =>
          currentType.id === type.id ? updatedType : currentType
        )
      );

      // On affiche un message de succès.
      setSuccess(type.estActif ? "Type d'abonnement désactivé." : "Type d'abonnement activé.");
    } catch (error) {
      // On affiche l'erreur.
      setError(error.message);
    } finally {
      // On arrête le traitement.
      setActionLoadingId(null);
    }
  }

  // Ce bloc se lance au chargement de la page.
  useEffect(() => {
    // On vérifie si le token existe.
    if (accessToken) {
      // On charge les données.
      loadData();
    }
  }, [accessToken]);

  // On retourne la page.
  return (
    <main className="admin-layout-page">
      {/* Menu latéral admin. */}
      <AdminSidebar />

      {/* Contenu principal admin. */}
      <section className="admin-content-page">
        {/* En-tête de page. */}
        <div className="admin-page-header">
          {/* Bloc titre. */}
          <div>
            {/* Petit titre. */}
            <span className="section-kicker">Administration</span>

            {/* Titre principal. */}
            <h1>Gestion des abonnements</h1>

            {/* Description. */}
            <p>Consultez les abonnements et gérez les types d'abonnement proposés aux vendeurs.</p>
          </div>
        </div>

        {/* Message de chargement. */}
        {loading && (
          <p className="page-message">
            Chargement des abonnements...
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

        {/* Contenu affiché après chargement. */}
        {!loading && (
          <>
            {/* Section formulaire. */}
            <section className="admin-subscription-section">
              {/* Titre. */}
              <h2>{editingTypeId ? "Modifier un type d'abonnement" : "Ajouter un type d'abonnement"}</h2>

              {/* Formulaire. */}
              <form className="admin-subscription-form" onSubmit={handleSubmit}>
                {/* Champ nom. */}
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Exemple : Basic"
                  />
                </div>

                {/* Champ prix. */}
                <div className="form-group">
                  <label>Prix</label>
                  <input
                    type="number"
                    name="prix"
                    min="0"
                    value={formData.prix}
                    onChange={handleChange}
                    placeholder="Exemple : 1000"
                  />
                </div>

                {/* Champ durée. */}
                <div className="form-group">
                  <label>Durée en jours</label>
                  <input
                    type="number"
                    name="dureeJours"
                    min="1"
                    value={formData.dureeJours}
                    onChange={handleChange}
                    placeholder="Exemple : 30"
                  />
                </div>

                {/* Champ limite. */}
                <div className="form-group">
                  <label>Limite de publication</label>
                  <input
                    type="number"
                    name="limitePublication"
                    min="1"
                    value={formData.limitePublication}
                    onChange={handleChange}
                    placeholder="Exemple : 10"
                  />
                </div>

                {/* Champ description. */}
                <div className="form-group form-group-full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description de l'offre"
                  />
                </div>

                {/* Actions du formulaire. */}
                <div className="admin-form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingTypeId ? "Modifier" : "Ajouter"}
                  </button>

                  {editingTypeId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Section types d'abonnement. */}
            <section className="admin-subscription-section">
              <h2>Types d'abonnement</h2>

              <div className="admin-table-wrapper">
                <table className="admin-subscription-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Durée</th>
                      <th>Limite</th>
                      <th>Statut</th>
                      <th>Création</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {typesAbonnement.map((type) => (
                      <tr key={type.id}>
                        <td>{type.nom}</td>
                        <td>{type.prix} FCFA</td>
                        <td>{type.dureeJours} jours</td>
                        <td>{type.limitePublication}</td>
                        <td>
                          <span className={type.estActif ? "type-status active" : "type-status inactive"}>
                            {type.estActif ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>{formatDate(type.dateCreation)}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleEdit(type)}
                            >
                              Modifier
                            </button>

                            <button
                              type="button"
                              className={type.estActif ? "btn btn-danger" : "btn btn-success"}
                              onClick={() => handleToggleStatus(type)}
                              disabled={actionLoadingId === type.id}
                            >
                              {actionLoadingId === type.id
                                ? "Traitement..."
                                : type.estActif
                                  ? "Désactiver"
                                  : "Activer"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {typesAbonnement.length === 0 && (
                      <tr>
                        <td colSpan="7">Aucun type d'abonnement trouvé.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section abonnements des membres. */}
            <section className="admin-subscription-section">
              <h2>Abonnements des membres</h2>

              <div className="admin-table-wrapper">
                <table className="admin-subscription-table">
                  <thead>
                    <tr>
                      <th>Membre</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Début</th>
                      <th>Fin</th>
                      <th>Statut</th>
                      <th>Limite</th>
                    </tr>
                  </thead>

                  <tbody>
                    {abonnements.map((abonnement) => (
                      <tr key={abonnement.id}>
                        <td>{abonnement.utilisateurNomComplet}</td>
                        <td>{abonnement.utilisateurEmail}</td>
                        <td>{abonnement.typeAbonnement}</td>
                        <td>{formatDate(abonnement.dateDebut)}</td>
                        <td>{formatDate(abonnement.dateFin)}</td>
                        <td>{abonnement.statutAbonnement}</td>
                        <td>{abonnement.limitePublication}</td>
                      </tr>
                    ))}

                    {abonnements.length === 0 && (
                      <tr>
                        <td colSpan="7">Aucun abonnement souscrit pour le moment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}