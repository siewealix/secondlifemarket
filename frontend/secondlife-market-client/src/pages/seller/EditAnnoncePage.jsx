// On importe useEffect pour charger les données au démarrage.
import { useEffect } from "react";

// On importe useState pour gérer le formulaire.
import { useState } from "react";

// On importe useNavigate pour rediriger après modification.
import { useNavigate } from "react-router-dom";

// On importe useParams pour lire l'id dans l'URL.
import { useParams } from "react-router-dom";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe le hook d'authentification.
import useAuth from "../../hooks/useAuth.js";

// On importe l'API des catégories.
import { getActiveCategoriesRequest } from "../../api/categorieApi.js";

// On importe les fonctions API des annonces.
import {
  getMyAnnoncesRequest,
  updateAnnonceRequest,
  uploadAnnoncePhotoRequest,
  publishAnnonceRequest,
} from "../../api/annonceApi.js";

// On définit les valeurs initiales du formulaire.
const initialForm = {
  // On initialise le titre.
  titre: "",

  // On initialise la description.
  description: "",

  // On initialise le prix.
  prix: "",

  // On initialise la ville.
  ville: "",

  // On initialise l'état de l'objet.
  etatObjet: "",

  // On initialise le statut.
  statut: "Disponible",

  // On initialise la catégorie.
  categorieId: "",
};

// On crée la page de modification d'annonce.
function EditAnnoncePage() {
  // On récupère l'id de l'annonce dans l'URL.
  const { id } = useParams();

  // On récupère le token du membre connecté.
  const { accessToken } = useAuth();

  // On prépare la navigation.
  const navigate = useNavigate();

  // On stocke le formulaire.
  const [form, setForm] = useState(initialForm);

  // On stocke les catégories.
  const [categories, setCategories] = useState([]);

  // On stocke le chargement.
  const [loading, setLoading] = useState(true);

  // On stocke l'état d'enregistrement.
  const [saving, setSaving] = useState(false);

  // On stocke l'erreur.
  const [error, setError] = useState("");

  // On stocke les nouvelles photos sélectionnées.
  const [photos, setPhotos] = useState([]);

  // On charge l'annonce et les catégories au démarrage.
  useEffect(() => {
    // On vérifie que le token existe.
    if (!accessToken) return;

    // On crée une fonction interne.
    async function loadData() {
      // On démarre le chargement.
      setLoading(true);

      // On vide l'erreur.
      setError("");

      // On essaie de charger les données.
      try {
        // On charge les catégories actives.
        const categoriesData = await getActiveCategoriesRequest();

        // On stocke les catégories.
        setCategories(categoriesData);

        // On charge les annonces du membre connecté.
        const myAnnonces = await getMyAnnoncesRequest(accessToken);

        // On cherche l'annonce à modifier.
        const annonceToEdit = myAnnonces.find((annonce) => annonce.id === Number(id));

        // On vérifie si l'annonce existe.
        if (!annonceToEdit) {
          // On affiche une erreur si elle n'existe pas.
          setError("Annonce introuvable dans vos annonces.");

          // On arrête la fonction.
          return;
        }

        // On remplit le formulaire avec les données existantes.
        setForm({
          // On remplit le titre.
          titre: annonceToEdit.titre,

          // On remplit la description.
          description: annonceToEdit.description,

          // On remplit le prix.
          prix: annonceToEdit.prix,

          // On remplit la ville.
          ville: annonceToEdit.ville,

          // On remplit l'état de l'objet.
          etatObjet: annonceToEdit.etatObjet,

          // On remplit le statut.
          statut: annonceToEdit.statut,

          // On remplit la catégorie.
          categorieId: annonceToEdit.categorieId,
        });
      } catch (requestError) {
        // On affiche l'erreur.
        setError(requestError.message);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance le chargement.
    loadData();
  }, [accessToken, id]);

  // On gère la saisie dans les champs.
  function handleChange(event) {
    // On récupère le nom du champ.
    const name = event.target.name;

    // On récupère la valeur saisie.
    const value = event.target.value;

    // On met à jour le formulaire.
    setForm((currentForm) => ({
      // On garde les anciennes valeurs.
      ...currentForm,

      // On modifie le champ concerné.
      [name]: value,
    }));

    // On vide l'erreur.
    setError("");
  }

  // On récupère les nouvelles photos choisies par l'utilisateur.
    function handlePhotosChange(event) {
    // On transforme les fichiers en tableau JavaScript.
    const selectedPhotos = Array.from(event.target.files);

    // On vérifie le nombre de photos.
    if (selectedPhotos.length > 5) {
        // On affiche une erreur.
        setError("Vous pouvez ajouter au maximum 5 photos à la fois.");

        // On vide les photos.
        setPhotos([]);

        // On arrête la fonction.
        return;
    }

    // On stocke les photos.
    setPhotos(selectedPhotos);

    // On vide l'erreur.
    setError("");
    }

  // On vérifie si le formulaire est valide.
  function isFormValid() {
    // On vérifie le titre.
    if (!form.titre.trim()) return false;

    // On vérifie la description.
    if (!form.description.trim()) return false;

    // On vérifie le prix.
    if (!form.prix || Number(form.prix) <= 0) return false;

    // On vérifie la ville.
    if (!form.ville.trim()) return false;

    // On vérifie l'état de l'objet.
    if (!form.etatObjet.trim()) return false;

    // On vérifie le statut.
    if (!form.statut.trim()) return false;

    // On vérifie la catégorie.
    if (!form.categorieId) return false;

    // On retourne vrai si tout est correct.
    return true;
  }

  // On soumet le formulaire.
  async function handleSubmit(event) {
    // On empêche le rechargement de la page.
    event.preventDefault();

    // On vide l'erreur.
    setError("");

    // On vérifie le formulaire.
    if (!isFormValid()) {
      // On affiche une erreur simple.
      setError("Veuillez remplir correctement tous les champs.");

      // On arrête la fonction.
      return;
    }

    // On démarre l'enregistrement.
    setSaving(true);

    // On prépare les données pour le backend.
    const annonceData = {
      // On envoie le titre.
      titre: form.titre,

      // On envoie la description.
      description: form.description,

      // On transforme le prix en nombre.
      prix: Number(form.prix),

      // On envoie la ville.
      ville: form.ville,

      // On envoie l'état de l'objet.
      etatObjet: form.etatObjet,

      // On envoie le statut.
      statut: form.statut,

      // On transforme la catégorie en nombre.
      categorieId: Number(form.categorieId),
    };

    // On essaie de modifier l'annonce.
    try {
      // On modifie d'abord l'annonce.
        await updateAnnonceRequest(id, annonceData, accessToken);

        // On envoie les nouvelles photos une par une.
        for (const photo of photos) {
        await uploadAnnoncePhotoRequest(id, photo, accessToken);
        }

        // On republie l'annonce.
        const publishedAnnonce = await publishAnnonceRequest(id, accessToken);

        // On vide les photos sélectionnées.
        setPhotos([]);

        // Si l'annonce est disponible, on va vers le détail public.
        if (publishedAnnonce.statut === "Disponible") {
        navigate(`/annonces/${publishedAnnonce.id}`);
        return;
        }

        // Si l'annonce part en réexamen admin, on retourne vers Mes annonces.
        if (publishedAnnonce.statut === "En réexamen admin") {
        alert("Votre annonce modifiée a été envoyée à l'administrateur pour réexamen.");
        navigate("/membre/vendeur/mes-annonces");
        return;
        }

        // Sinon, retour vers Mes annonces.
        navigate("/membre/vendeur/mes-annonces");
    } catch (requestError) {
      // On affiche l'erreur.
      setError(requestError.message);
    } finally {
      // On arrête l'enregistrement.
      setSaving(false);
    }
  }

  // On retourne la page.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On crée le contenu principal. */}
      <main className="create-annonce-page">
        {/* En-tête de page. */}
        <section className="create-annonce-header">
          {/* Titre. */}
          <h1>Modifier l’annonce</h1>

          {/* Description. */}
          <p>Modifiez les informations de votre annonce publiée sur SecondLife Market.</p>
        </section>

        {/* Message de chargement. */}
        {loading && (
          <p className="section-loading">Chargement de l’annonce...</p>
        )}

        {/* Formulaire affiché seulement après chargement. */}
        {!loading && (
          <form className="create-annonce-card" onSubmit={handleSubmit}>
            {/* Message d'erreur. */}
            {error && (
              <p className="auth-server-error" role="alert">
                {error}
              </p>
            )}

            {/* Champ titre. */}
            <div className="admin-field">
              {/* Label titre. */}
              <label htmlFor="titre">Titre de l’annonce *</label>

              {/* Input titre. */}
              <input
                id="titre"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ description. */}
            <div className="admin-field">
              {/* Label description. */}
              <label htmlFor="description">Description *</label>

              {/* Textarea description. */}
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Ligne prix et ville. */}
            <div className="form-two-columns">
              {/* Champ prix. */}
              <div className="admin-field">
                {/* Label prix. */}
                <label htmlFor="prix">Prix en FCFA *</label>

                {/* Input prix. */}
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  min="1"
                  value={form.prix}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Champ ville. */}
              <div className="admin-field">
                {/* Label ville. */}
                <label htmlFor="ville">Ville *</label>

                {/* Input ville. */}
                <input
                  id="ville"
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Ligne état et catégorie. */}
            <div className="form-two-columns">
              {/* Champ état. */}
              <div className="admin-field">
                {/* Label état. */}
                <label htmlFor="etatObjet">État de l’objet *</label>

                {/* Select état. */}
                <select
                  id="etatObjet"
                  name="etatObjet"
                  value={form.etatObjet}
                  onChange={handleChange}
                  required
                >
                  {/* Option vide. */}
                  <option value="">Choisir un état</option>

                  {/* Option neuf. */}
                  <option value="Neuf">Neuf</option>

                  {/* Option très bon état. */}
                  <option value="Très bon état">Très bon état</option>

                  {/* Option bon état. */}
                  <option value="Bon état">Bon état</option>

                  {/* Option état moyen. */}
                  <option value="État moyen">État moyen</option>

                  {/* Option à réparer. */}
                  <option value="À réparer">À réparer</option>
                </select>
              </div>

              {/* Champ catégorie. */}
              <div className="admin-field">
                {/* Label catégorie. */}
                <label htmlFor="categorieId">Catégorie *</label>

                {/* Select catégorie. */}
                <select
                  id="categorieId"
                  name="categorieId"
                  value={form.categorieId}
                  onChange={handleChange}
                  required
                >
                  {/* Option vide. */}
                  <option value="">Choisir une catégorie</option>

                  {/* Options catégories. */}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icone} {category.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Champ statut. */}
            <div className="admin-field">
              {/* Label statut. */}
              <label htmlFor="statut">Statut *</label>

              {/* Select statut. */}
              <select
                id="statut"
                name="statut"
                value={form.statut}
                onChange={handleChange}
                required
              >
                {/* Disponible. */}
                <option value="Disponible">Disponible</option>

                {/* Réservée. */}
                <option value="Réservée">Réservée</option>

                {/* Vendue. */}
                <option value="Vendu">Vendu</option>
              </select>
            </div>

            {/* Champ nouvelles photos. */}
            <div className="admin-field">
            {/* Label photos. */}
            <label htmlFor="photos">Ajouter de nouvelles photos</label>

            {/* Input photos multiples. */}
            <input
                id="photos"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotosChange}
            />
            </div>

            {/* Liste des nouvelles photos choisies. */}
            {photos.length > 0 && (
            <div className="selected-photos-list">
                {/* On affiche chaque nom de photo. */}
                {photos.map((photo) => (
                <span key={photo.name}>
                    {photo.name}
                </span>
                ))}
            </div>
            )}

            {/* Actions. */}
            <div className="admin-actions">
              {/* Bouton modifier. */}
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Modification..." : "Modifier l’annonce"}
              </button>

              {/* Bouton retour. */}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/membre/vendeur/mes-annonces")}
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default EditAnnoncePage;