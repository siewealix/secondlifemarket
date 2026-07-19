// On importe useEffect pour charger les annonces au démarrage.
import { useEffect } from "react";

// On importe useState pour stocker les annonces et les filtres.
import { useState } from "react";

// On importe les outils de navigation.
import {
  Link,
  useSearchParams,
} from "react-router-dom";

// On importe les icônes utilisées dans la page.
import {
  ArrowRight,
  CircleAlert,
  FilePlus2,
  LoaderCircle,
  PackageSearch,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

// On importe la navbar.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le footer.
import Footer from "../../components/layout/Footer.jsx";

// On importe la carte d'annonce.
import ProductCard from "../../components/ui/ProductCard.jsx";

// On importe la fonction API.
import { getPublicAnnoncesRequest } from "../../api/annonceApi.js";

// On crée la page des annonces.
function AnnoncesPage() {
  // On récupère les paramètres présents dans l'URL.
  const [searchParams, setSearchParams] = useSearchParams();

  // On récupère la recherche envoyée depuis la page d'accueil.
  const rechercheUrl = searchParams.get("recherche") || "";

  // On stocke les annonces reçues depuis le backend.
  const [annonces, setAnnonces] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke le texte recherché.
  const [searchName, setSearchName] = useState(rechercheUrl);

  // On stocke la catégorie sélectionnée.
  const [selectedCategory, setSelectedCategory] = useState("");

  // On stocke le prix minimum.
  const [minPrice, setMinPrice] = useState("");

  // On stocke le prix maximum.
  const [maxPrice, setMaxPrice] = useState("");

  // On stocke le type de tri.
  const [sortOrder, setSortOrder] = useState("recent");

  // Cette fonction charge les annonces depuis le backend.
  async function loadAnnonces() {
    // On active le chargement.
    setLoading(true);

    // On efface l'ancienne erreur.
    setError("");

    try {
      // On appelle l'API.
      const data = await getPublicAnnoncesRequest();

      // On stocke les annonces reçues.
      setAnnonces(data);
    } catch (requestError) {
      // On affiche le message d'erreur.
      setError(requestError.message);
    } finally {
      // On arrête le chargement.
      setLoading(false);
    }
  }

  // On charge les annonces au démarrage.
  useEffect(() => {
    // On appelle la fonction de chargement.
    loadAnnonces();
  }, []);

  // On actualise la recherche lorsque l'URL change.
  useEffect(() => {
    // On utilise la valeur reçue dans l'URL.
    setSearchName(rechercheUrl);
  }, [rechercheUrl]);

  // On construit la liste des catégories présentes dans les annonces.
  const categories = Array.from(
    // Map permet de supprimer les catégories répétées.
    new Map(
      // On parcourt les annonces.
      annonces
        // On garde les annonces qui possèdent une catégorie.
        .filter(
          (annonce) =>
            annonce.categorieId != null &&
            annonce.nomCategorie
        )

        // On transforme chaque catégorie en paire clé-valeur.
        .map((annonce) => [
          // La clé correspond à l'identifiant.
          annonce.categorieId,

          // La valeur contient les informations de la catégorie.
          {
            id: annonce.categorieId,
            nom: annonce.nomCategorie,
          },
        ])
    ).values()
  )
    // On classe les catégories par ordre alphabétique.
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

  // On vérifie si les prix sont incohérents.
  const prixInvalide =
    // On vérifie que les deux prix sont remplis.
    minPrice !== "" &&
    maxPrice !== "" &&

    // On vérifie si le minimum dépasse le maximum.
    Number(minPrice) > Number(maxPrice);

  // On filtre et trie les annonces.
  const filteredAnnonces = annonces
    // On filtre selon les critères.
    .filter((annonce) => {
      // On nettoie le texte recherché.
      const searchText = searchName.toLowerCase().trim();

      // On sécurise et transforme le titre en minuscules.
      const titre = String(annonce.titre || "").toLowerCase();

      // On sécurise et transforme la description en minuscules.
      const description = String(
        annonce.description || ""
      ).toLowerCase();

      // On vérifie la correspondance du texte.
      const nameMatch =
        searchText === "" ||
        titre.includes(searchText) ||
        description.includes(searchText);

      // On vérifie la correspondance de la catégorie.
      const categoryMatch =
        selectedCategory === "" ||
        annonce.categorieId === Number(selectedCategory);

      // On vérifie le prix minimum.
      const minPriceMatch =
        minPrice === "" ||
        annonce.prix >= Number(minPrice);

      // On vérifie le prix maximum.
      const maxPriceMatch =
        maxPrice === "" ||
        annonce.prix <= Number(maxPrice);

      // Si les prix sont incohérents, on bloque les résultats.
      if (prixInvalide) {
        return false;
      }

      // On conserve l'annonce si tous les critères correspondent.
      return (
        nameMatch &&
        categoryMatch &&
        minPriceMatch &&
        maxPriceMatch
      );
    })

    // On trie les annonces filtrées.
    .sort((a, b) => {
      // On trie du prix le plus petit au plus grand.
      if (sortOrder === "prix_asc") {
        return a.prix - b.prix;
      }

      // On trie du prix le plus grand au plus petit.
      if (sortOrder === "prix_desc") {
        return b.prix - a.prix;
      }

      // Par défaut, on affiche les annonces les plus récentes.
      return (
        new Date(b.datePublication) -
        new Date(a.datePublication)
      );
    });

  // On compte le nombre de filtres actuellement utilisés.
  const activeFiltersCount = [
    searchName.trim() !== "",
    selectedCategory !== "",
    minPrice !== "",
    maxPrice !== "",
    sortOrder !== "recent",
  ].filter(Boolean).length;

  // On vérifie si au moins un filtre est actif.
  const hasActiveFilters = activeFiltersCount > 0;

  // On réinitialise tous les filtres.
  function resetFilters() {
    // On vide la recherche.
    setSearchName("");

    // On vide la catégorie.
    setSelectedCategory("");

    // On vide le prix minimum.
    setMinPrice("");

    // On vide le prix maximum.
    setMaxPrice("");

    // On restaure le tri par défaut.
    setSortOrder("recent");

    // On retire également la recherche présente dans l'URL.
    setSearchParams({});
  }

  // On retourne la page.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* On affiche le contenu principal. */}
      <main className="annonces-page">
        {/* On centre le contenu. */}
        <div className="container annonces-page-container">
          {/* On crée le bandeau principal. */}
          <header className="annonces-hero">
            {/* On crée la partie contenant les textes. */}
            <div className="annonces-hero-content">
              {/* On affiche une petite indication. */}
              <span className="annonces-hero-label">
                <PackageSearch size={17} aria-hidden="true" />

                Marketplace d’occasion
              </span>

              {/* On affiche le titre principal. */}
              <h1>Trouvez l’objet qu’il vous faut</h1>

              {/* On affiche la description. */}
              <p>
                Recherchez parmi les objets d’occasion publiés par les membres
                de SecondLife Market et trouvez facilement la bonne annonce.
              </p>

              {/* On affiche les chiffres réels après le chargement. */}
              {!loading && !error && (
                <div className="annonces-hero-stats">
                  {/* On affiche le nombre total d'annonces. */}
                  <div>
                    <strong>{annonces.length}</strong>

                    <span>
                      {annonces.length > 1
                        ? "annonces disponibles"
                        : "annonce disponible"}
                    </span>
                  </div>

                  {/* On affiche le nombre de catégories. */}
                  <div>
                    <strong>{categories.length}</strong>

                    <span>
                      {categories.length > 1
                        ? "catégories"
                        : "catégorie"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* On permet de publier une annonce. */}
            <Link
              className="annonces-hero-action"
              to="/membre/vendeur/annonces/nouvelle"
            >
              <FilePlus2 size={20} aria-hidden="true" />

              Publier une annonce

              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </header>

          {/* On affiche le chargement. */}
          {loading && (
            <div
              className="annonces-loading-state"
              role="status"
            >
              {/* On affiche une icône animée. */}
              <LoaderCircle
                className="annonces-loading-icon"
                size={36}
                aria-hidden="true"
              />

              {/* On affiche le message. */}
              <div>
                <strong>Chargement des annonces</strong>

                <p>Nous récupérons les objets disponibles.</p>
              </div>
            </div>
          )}

          {/* On affiche l'erreur. */}
          {!loading && error && (
            <div
              className="annonces-error-state"
              role="alert"
            >
              {/* On affiche l'icône d'erreur. */}
              <CircleAlert size={32} aria-hidden="true" />

              {/* On affiche le contenu de l'erreur. */}
              <div>
                <strong>Impossible de charger les annonces</strong>

                <p>{error}</p>

                {/* On permet de relancer la requête. */}
                <button
                  type="button"
                  className="annonces-retry-button"
                  onClick={loadAnnonces}
                >
                  <RefreshCw size={17} aria-hidden="true" />

                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* On affiche les filtres lorsque les annonces sont chargées. */}
          {!loading && !error && annonces.length > 0 && (
            <section
              className="annonces-filter-panel"
              aria-labelledby="annonces-filter-title"
            >
              {/* On crée l'en-tête des filtres. */}
              <div className="annonces-filter-header">
                {/* On affiche le titre et l'explication. */}
                <div>
                  <span>Recherche personnalisée</span>

                  <h2 id="annonces-filter-title">
                    <SlidersHorizontal
                      size={22}
                      aria-hidden="true"
                    />

                    Rechercher et filtrer
                  </h2>

                  <p>
                    Affinez les résultats selon votre budget et vos besoins.
                  </p>
                </div>

                {/* On affiche les actions des filtres. */}
                <div className="annonces-filter-actions">
                  {/* On affiche le nombre de filtres actifs. */}
                  {hasActiveFilters && (
                    <span className="annonces-active-filters">
                      {activeFiltersCount}{" "}
                      {activeFiltersCount > 1
                        ? "filtres actifs"
                        : "filtre actif"}
                    </span>
                  )}

                  {/* On permet de réinitialiser les filtres. */}
                  <button
                    type="button"
                    className="annonces-reset-button"
                    onClick={resetFilters}
                    disabled={!hasActiveFilters}
                  >
                    <RotateCcw size={17} aria-hidden="true" />

                    Réinitialiser
                  </button>
                </div>
              </div>

              {/* On affiche les différents champs. */}
              <div className="annonces-filters-grid">
                {/* On crée le champ de recherche principal. */}
                <div className="annonces-filter-group annonces-filter-search">
                  {/* On associe le label au champ. */}
                  <label htmlFor="annonces-search">
                    Rechercher un produit
                  </label>

                  {/* On crée le conteneur du champ et de l'icône. */}
                  <div className="annonces-search-field">
                    {/* On affiche l'icône. */}
                    <Search size={19} aria-hidden="true" />

                    {/* On crée le champ. */}
                    <input
                      id="annonces-search"
                      type="search"
                      placeholder="Téléphone, chaussure, ordinateur..."
                      value={searchName}
                      onChange={(event) =>
                        setSearchName(event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* On crée le filtre des catégories. */}
                <div className="annonces-filter-group">
                  <label htmlFor="annonces-category">
                    Catégorie
                  </label>

                  <select
                    id="annonces-category"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                  >
                    <option value="">
                      Toutes les catégories
                    </option>

                    {categories.map((categorie) => (
                      <option
                        key={categorie.id}
                        value={categorie.id}
                      >
                        {categorie.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* On crée le filtre du prix minimum. */}
                <div className="annonces-filter-group">
                  <label htmlFor="annonces-min-price">
                    Prix minimum
                  </label>

                  <input
                    id="annonces-min-price"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="FCFA"
                    value={minPrice}
                    aria-invalid={prixInvalide}
                    aria-describedby={
                      prixInvalide
                        ? "annonces-price-error"
                        : undefined
                    }
                    onChange={(event) =>
                      setMinPrice(event.target.value)
                    }
                  />
                </div>

                {/* On crée le filtre du prix maximum. */}
                <div className="annonces-filter-group">
                  <label htmlFor="annonces-max-price">
                    Prix maximum
                  </label>

                  <input
                    id="annonces-max-price"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="FCFA"
                    value={maxPrice}
                    aria-invalid={prixInvalide}
                    aria-describedby={
                      prixInvalide
                        ? "annonces-price-error"
                        : undefined
                    }
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                  />
                </div>

                {/* On crée le sélecteur de tri. */}
                <div className="annonces-filter-group">
                  <label htmlFor="annonces-sort">
                    Trier par
                  </label>

                  <select
                    id="annonces-sort"
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(event.target.value)
                    }
                  >
                    <option value="recent">
                      Plus récent
                    </option>

                    <option value="prix_asc">
                      Prix croissant
                    </option>

                    <option value="prix_desc">
                      Prix décroissant
                    </option>
                  </select>
                </div>
              </div>

              {/* On affiche l'erreur concernant les prix. */}
              {prixInvalide && (
                <p
                  id="annonces-price-error"
                  className="annonces-price-error"
                  role="alert"
                >
                  Le prix minimum ne peut pas être supérieur au prix maximum.
                </p>
              )}
            </section>
          )}

          {/* On affiche un état vide si aucune annonce n'existe. */}
          {!loading && !error && annonces.length === 0 && (
            <section className="annonces-empty-state">
              {/* On affiche l'icône. */}
              <PackageSearch size={48} aria-hidden="true" />

              {/* On affiche le titre. */}
              <h2>Aucune annonce disponible</h2>

              {/* On affiche l'explication. */}
              <p>
                Aucune annonce n’est actuellement publiée sur la plateforme.
              </p>

              {/* On permet de publier la première annonce. */}
              <Link
                to="/membre/vendeur/annonces/nouvelle"
                className="annonces-empty-link"
              >
                Publier une annonce

                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </section>
          )}

          {/* On affiche les résultats. */}
          {!loading &&
            !error &&
            annonces.length > 0 &&
            !prixInvalide && (
              <section
                className="annonces-results"
                aria-labelledby="annonces-results-title"
              >
                {/* On crée l'en-tête des résultats. */}
                <div className="annonces-results-header">
                  {/* On affiche le nombre de résultats. */}
                  <div>
                    <span>Résultats</span>

                    <h2 id="annonces-results-title">
                      {filteredAnnonces.length}{" "}
                      {filteredAnnonces.length > 1
                        ? "annonces trouvées"
                        : "annonce trouvée"}
                    </h2>
                  </div>

                  {/* On rappelle le type de tri. */}
                  <p aria-live="polite">
                    {sortOrder === "prix_asc" &&
                      "Classées du prix le plus bas au plus élevé."}

                    {sortOrder === "prix_desc" &&
                      "Classées du prix le plus élevé au plus bas."}

                    {sortOrder === "recent" &&
                      "Les annonces les plus récentes apparaissent en premier."}
                  </p>
                </div>

                {/* On affiche les annonces trouvées. */}
                {filteredAnnonces.length > 0 && (
                  <div className="annonces-products-grid">
                    {/* On affiche chaque annonce. */}
                    {filteredAnnonces.map((annonce) => (
                      <ProductCard
                        key={annonce.id}
                        annonce={annonce}
                      />
                    ))}
                  </div>
                )}

                {/* On affiche un message si aucun résultat ne correspond. */}
                {filteredAnnonces.length === 0 && (
                  <div className="annonces-no-results">
                    {/* On affiche l'icône. */}
                    <Search size={42} aria-hidden="true" />

                    {/* On affiche le titre. */}
                    <h3>Aucun résultat trouvé</h3>

                    {/* On affiche l'explication. */}
                    <p>
                      Essayez de modifier votre recherche, votre catégorie ou
                      votre budget.
                    </p>

                    {/* On permet de vider les filtres. */}
                    <button
                      type="button"
                      onClick={resetFilters}
                    >
                      <RotateCcw size={17} aria-hidden="true" />

                      Effacer les filtres
                    </button>
                  </div>
                )}
              </section>
            )}
        </div>
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default AnnoncesPage;