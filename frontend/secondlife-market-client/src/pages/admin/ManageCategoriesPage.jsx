// On importe useEffect pour charger les catégories au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer les données de la page.
import { useState } from "react";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le menu latéral administrateur.
import AdminSidebar from "../../components/layout/AdminSidebar.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe les fonctions API des catégories.
import {
  getAdminCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from "../../api/categorieApi.js";

// On définit les valeurs initiales du formulaire.
const initialForm = {
  // On initialise le nom.
  nom: "",

  // On initialise la description.
  description: "",

  // On initialise l'icône.
  icone: "",

  // On initialise l'état actif.
  estActive: true,
};

// On crée la page de gestion des catégories.
function ManageCategoriesPage() {
  // On récupère le token de l'administrateur.
  const { accessToken } = useAuth();

  // On stocke les catégories.
  const [categories, setCategories] = useState([]);

  // On stocke les données du formulaire.
  const [form, setForm] = useState(initialForm);

  // On stocke l'id de la catégorie en modification.
  const [editingId, setEditingId] = useState(null);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'état d'envoi du formulaire.
  const [saving, setSaving] = useState(false);

  // On stocke les erreurs.
  const [error, setError] = useState("");

  // On stocke les messages de succès.
  const [success, setSuccess] = useState("");

  // On charge les catégories au démarrage.
  useEffect(() => {
    // On appelle la fonction de chargement.
    loadCategories();
  }, []);

  // On crée la fonction qui charge les catégories.
  async function loadCategories() {
    // On démarre le chargement.
    setLoading(true);

    // On vide l'erreur.
    setError("");

    // On essaie de charger les catégories.
    try {
      // On appelle l'API admin.
      const data = await getAdminCategoriesRequest(accessToken);

      // On stocke les catégories reçues.
      setCategories(data);
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    } finally {
      // On arrête le chargement.
      setLoading(false);
    }
  }

  // On gère la saisie dans les champs.
  function handleChange(event) {
    // On récupère le nom du champ.
    const name = event.target.name;

    // On récupère la valeur du champ.
    const value = event.target.value;

    // On met à jour le formulaire.
    setForm((currentForm) => ({
      // On garde les anciennes valeurs.
      ...currentForm,

      // On remplace le champ modifié.
      [name]: value,
    }));

    // On vide l'erreur.
    setError("");

    // On vide le succès.
    setSuccess("");
  }

  // On gère le changement du statut actif.
  function handleStatusChange(event) {
    // On récupère la valeur booléenne.
    const checked = event.target.checked;

    // On met à jour le formulaire.
    setForm((currentForm) => ({
      // On garde les anciennes valeurs.
      ...currentForm,

      // On met à jour estActive.
      estActive: checked,
    }));
  }

  // On vérifie si le formulaire est valide.
  function isFormValid() {
    // On vérifie si le nom est rempli.
    if (!form.nom.trim()) return false;

    // On vérifie si la description est remplie.
    if (!form.description.trim()) return false;

    // On vérifie si l'icône est remplie.
    if (!form.icone.trim()) return false;

    // On retourne vrai si tout est bon.
    return true;
  }

  // On soumet le formulaire.
  async function handleSubmit(event) {
    // On empêche le rechargement de la page.
    event.preventDefault();

    // On vide l'erreur.
    setError("");

    // On vide le succès.
    setSuccess("");

    // On bloque si le formulaire est invalide.
    if (!isFormValid()) {
      // On affiche une erreur simple.
      setError(
        "Veuillez remplir le nom, la description et l'icône."
      );

      // On arrête la fonction.
      return;
    }

    // On démarre l'envoi.
    setSaving(true);

    // On prépare les données à envoyer.
    const categoryData = {
      // On envoie le nom.
      nom: form.nom,

      // On envoie la description.
      description: form.description,

      // On envoie l'icône.
      icone: form.icone,

      // On envoie l'état actif.
      estActive: form.estActive,
    };

    // On essaie d'envoyer les données.
    try {
      // On vérifie si on modifie une catégorie.
      if (editingId) {
        // On appelle la modification.
        await updateCategoryRequest(
          editingId,
          categoryData,
          accessToken
        );

        // On affiche un succès.
        setSuccess("Catégorie modifiée avec succès.");
      } else {
        // On appelle la création.
        await createCategoryRequest(
          categoryData,
          accessToken
        );

        // On affiche un succès.
        setSuccess("Catégorie créée avec succès.");
      }

      // On remet le formulaire à zéro.
      setForm(initialForm);

      // On quitte le mode modification.
      setEditingId(null);

      // On recharge les catégories.
      await loadCategories();
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    } finally {
      // On arrête l'envoi.
      setSaving(false);
    }
  }

  // On active le mode modification.
  function handleEdit(category) {
    // On met l'id en modification.
    setEditingId(category.id);

    // On remplit le formulaire avec la catégorie.
    setForm({
      // On remplit le nom.
      nom: category.nom,

      // On remplit la description.
      description: category.description,

      // On remplit l'icône.
      icone: category.icone,

      // On remplit l'état actif.
      estActive: category.estActive,
    });

    // On vide le message d'erreur.
    setError("");

    // On vide le message de succès.
    setSuccess("");
  }

  // On annule la modification.
  function handleCancelEdit() {
    // On remet l'id à null.
    setEditingId(null);

    // On remet le formulaire à zéro.
    setForm(initialForm);

    // On vide l'erreur.
    setError("");

    // On vide le succès.
    setSuccess("");
  }

  // On désactive une catégorie.
  async function handleDelete(categoryId) {
    // On demande une confirmation simple.
    const confirmed = window.confirm(
      "Voulez-vous vraiment désactiver cette catégorie ?"
    );

    // On arrête si l'administrateur refuse.
    if (!confirmed) {
      return;
    }

    // On vide l'erreur.
    setError("");

    // On vide le succès.
    setSuccess("");

    // On essaie de désactiver la catégorie.
    try {
      // On appelle l'API DELETE.
      await deleteCategoryRequest(
        categoryId,
        accessToken
      );

      // On affiche un message.
      setSuccess("Catégorie désactivée avec succès.");

      // On recharge les catégories.
      await loadCategories();
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    }
  }

  // On retourne la page.
  return (
    // On regroupe la navbar et la page.
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On crée le contenu principal. */}
      <main className="admin-page">
        {/* On organise la sidebar et le contenu côte à côte. */}
        <div className="admin-page-layout">
          {/* On affiche le menu latéral administrateur. */}
          <AdminSidebar />

          {/* On regroupe le contenu de la page. */}
          <section className="admin-page-content">
            {/* On crée l'en-tête de page. */}
            <section className="admin-page-header">
              {/* On affiche le titre. */}
              <h1>Gestion des catégories</h1>

              {/* On affiche la description. */}
              <p>
                Ajoutez, modifiez ou désactivez les
                catégories utilisées pour les annonces.
              </p>
            </section>

            {/* On affiche les erreurs. */}
            {error && (
              // Message d'erreur accessible.
              <p
                className="auth-server-error"
                role="alert"
              >
                {/* Texte de l'erreur. */}
                {error}
              </p>
            )}

            {/* On affiche les succès. */}
            {success && (
              // Message de succès accessible.
              <p
                className="admin-success"
                role="status"
              >
                {/* Texte du succès. */}
                {success}
              </p>
            )}

            {/* On crée la grille de la page admin. */}
            <section className="admin-grid">
              {/* On crée le formulaire. */}
              <form
                className="admin-card"
                onSubmit={handleSubmit}
              >
                {/* On affiche le titre du formulaire. */}
                <h2>
                  {editingId
                    ? "Modifier une catégorie"
                    : "Ajouter une catégorie"}
                </h2>

                {/* On crée le champ du nom. */}
                <div className="admin-field">
                  {/* On associe le texte au champ. */}
                  <label htmlFor="category-name">
                    Nom *
                  </label>

                  {/* On crée le champ du nom. */}
                  <input
                    id="category-name"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Ex : Meubles"
                    required
                  />
                </div>

                {/* On crée le champ de la description. */}
                <div className="admin-field">
                  {/* On associe le texte au champ. */}
                  <label htmlFor="category-description">
                    Description *
                  </label>

                  {/* On crée la zone de description. */}
                  <textarea
                    id="category-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Ex : Tables, chaises, armoires..."
                    required
                  />
                </div>

                {/* On crée le champ de l'icône. */}
                <div className="admin-field">
                  {/* On associe le texte au champ. */}
                  <label htmlFor="category-icon">
                    Icône *
                  </label>

                  {/* On crée le champ de l'icône. */}
                  <input
                    id="category-icon"
                    name="icone"
                    value={form.icone}
                    onChange={handleChange}
                    placeholder="Ex : 🪑"
                    required
                  />
                </div>

                {/* On crée le champ du statut actif. */}
                <label className="admin-checkbox">
                  {/* On crée la case à cocher. */}
                  <input
                    type="checkbox"
                    checked={form.estActive}
                    onChange={handleStatusChange}
                  />

                  {/* On affiche le texte du statut. */}
                  <span>Catégorie active</span>
                </label>

                {/* On affiche les boutons du formulaire. */}
                <div className="admin-actions">
                  {/* On affiche le bouton principal. */}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={saving}
                  >
                    {/* On adapte le texte du bouton. */}
                    {saving
                      ? "Enregistrement..."
                      : editingId
                        ? "Modifier"
                        : "Ajouter"}
                  </button>

                  {/* On affiche Annuler en mode modification. */}
                  {editingId && (
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={handleCancelEdit}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>

              {/* On crée la carte de la liste. */}
              <div className="admin-card">
                {/* On affiche le titre de la liste. */}
                <h2>Liste des catégories</h2>

                {/* On affiche le chargement. */}
                {loading && (
                  <p className="section-loading">
                    Chargement...
                  </p>
                )}

                {/* On affiche le message si la liste est vide. */}
                {!loading && categories.length === 0 && (
                  <p className="section-empty">
                    Aucune catégorie disponible.
                  </p>
                )}

                {/* On affiche le tableau. */}
                {!loading && categories.length > 0 && (
                  <div className="admin-table-wrapper">
                    {/* On crée le tableau. */}
                    <table className="admin-table">
                      {/* On crée l'en-tête du tableau. */}
                      <thead>
                        <tr>
                          {/* Colonne icône. */}
                          <th>Icône</th>

                          {/* Colonne nom. */}
                          <th>Nom</th>

                          {/* Colonne statut. */}
                          <th>Statut</th>

                          {/* Colonne actions. */}
                          <th>Actions</th>
                        </tr>
                      </thead>

                      {/* On crée le corps du tableau. */}
                      <tbody>
                        {/* On parcourt les catégories. */}
                        {categories.map((category) => (
                          // On crée une ligne par catégorie.
                          <tr key={category.id}>
                            {/* On affiche l'icône. */}
                            <td>{category.icone}</td>

                            {/* On affiche le nom et la description. */}
                            <td>
                              {/* On affiche le nom. */}
                              <strong>
                                {category.nom}
                              </strong>

                              {/* On affiche la description. */}
                              <p>
                                {category.description}
                              </p>
                            </td>

                            {/* On affiche le statut. */}
                            <td>
                              <span
                                className={
                                  category.estActive
                                    ? "badge-active"
                                    : "badge-inactive"
                                }
                              >
                                {category.estActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            {/* On affiche les actions. */}
                            <td>
                              {/* Bouton de modification. */}
                              <button
                                type="button"
                                className="table-link"
                                onClick={() =>
                                  handleEdit(category)
                                }
                              >
                                Modifier
                              </button>

                              {/* Bouton de désactivation. */}
                              <button
                                type="button"
                                className="table-danger"
                                onClick={() =>
                                  handleDelete(
                                    category.id
                                  )
                                }
                              >
                                Désactiver
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}

// On exporte la page.
export default ManageCategoriesPage;