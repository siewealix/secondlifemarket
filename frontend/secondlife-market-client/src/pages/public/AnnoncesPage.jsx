// On importe useEffect pour charger les annonces au démarrage.
import { useEffect } from "react";

// On importe useState pour stocker les annonces et les filtres.
import { useState } from "react";

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
  // On stocke les annonces récupérées depuis le backend.
  const [annonces, setAnnonces] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke le message d'erreur.
  const [error, setError] = useState("");

  // On stocke le texte saisi pour rechercher une annonce par nom.
  const [searchName, setSearchName] = useState("");

  // On stocke la catégorie choisie par l'utilisateur.
  const [selectedCategory, setSelectedCategory] = useState("");

  // On stocke le prix minimum saisi par l'utilisateur.
  const [minPrice, setMinPrice] = useState("");

  // On stocke le prix maximum saisi par l'utilisateur.
  const [maxPrice, setMaxPrice] = useState("");

  // On stocke le type de tri choisi par l'utilisateur.
  const [sortOrder, setSortOrder] = useState("recent");

  // On charge les annonces au démarrage.
  useEffect(() => {
    // On crée une fonction interne pour charger les annonces.
    async function loadAnnonces() {
      // On essaie de charger les annonces.
      try {
        // On appelle l'API du backend.
        const data = await getPublicAnnoncesRequest();

        // On stocke les annonces reçues.
        setAnnonces(data);

        // On vide l'erreur.
        setError("");
      } catch (requestError) {
        // On stocke l'erreur reçue.
        setError(requestError.message);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance le chargement.
    loadAnnonces();
  }, []);

  // On construit automatiquement la liste des catégories à partir des annonces.
  const categories = Array.from(
    // On utilise Map pour éviter les catégories répétées.
    new Map(
      // On transforme chaque annonce en paire clé-valeur.
      annonces
        // On garde seulement les annonces qui ont une catégorie valide.
        .filter((annonce) => annonce.categorieId && annonce.nomCategorie)
        // On prépare chaque catégorie.
        .map((annonce) => [
          // La clé est l'identifiant de la catégorie.
          annonce.categorieId,

          // La valeur contient l'identifiant et le nom de la catégorie.
          {
            // Identifiant de la catégorie.
            id: annonce.categorieId,

            // Nom de la catégorie.
            nom: annonce.nomCategorie,
          },
        ])
    ).values()
  );

  // On vérifie si les prix saisis sont cohérents.
  const prixInvalide =
    // On vérifie si les deux prix sont renseignés.
    minPrice !== "" &&
    maxPrice !== "" &&

    // On vérifie si le prix minimum est supérieur au prix maximum.
    Number(minPrice) > Number(maxPrice);

  // On filtre et on trie les annonces.
  const filteredAnnonces = annonces
    // On filtre les annonces selon les critères saisis.
    .filter((annonce) => {
      // On transforme le texte recherché en minuscule.
      const searchText = searchName.toLowerCase().trim();

      // On récupère le titre de l'annonce en minuscule.
      const titre = annonce.titre.toLowerCase();

      // On récupère la description de l'annonce en minuscule.
      const description = annonce.description.toLowerCase();

      // On vérifie si le titre ou la description contient le texte recherché.
      const nameMatch =
        // Si aucun texte n'est saisi, on accepte toutes les annonces.
        searchText === "" ||

        // Sinon, on cherche dans le titre.
        titre.includes(searchText) ||

        // On cherche aussi dans la description.
        description.includes(searchText);

      // On vérifie si la catégorie correspond.
      const categoryMatch =
        // Si aucune catégorie n'est choisie, on accepte toutes les annonces.
        selectedCategory === "" ||

        // Sinon, on garde seulement les annonces de la catégorie choisie.
        annonce.categorieId === Number(selectedCategory);

      // On vérifie si le prix est supérieur ou égal au prix minimum.
      const minPriceMatch =
        // Si aucun prix minimum n'est saisi, on accepte l'annonce.
        minPrice === "" ||

        // Sinon, on compare le prix de l'annonce au prix minimum.
        annonce.prix >= Number(minPrice);

      // On vérifie si le prix est inférieur ou égal au prix maximum.
      const maxPriceMatch =
        // Si aucun prix maximum n'est saisi, on accepte l'annonce.
        maxPrice === "" ||

        // Sinon, on compare le prix de l'annonce au prix maximum.
        annonce.prix <= Number(maxPrice);

      // Si les prix sont invalides, on ne retourne aucun résultat.
      if (prixInvalide) {
        // On bloque le résultat.
        return false;
      }

      // On garde l'annonce seulement si tous les critères sont respectés.
      return nameMatch && categoryMatch && minPriceMatch && maxPriceMatch;
    })

    // On trie les annonces filtrées.
    .sort((a, b) => {
      // Si l'utilisateur choisit le prix croissant.
      if (sortOrder === "prix_asc") {
        // On trie du prix le plus petit au prix le plus grand.
        return a.prix - b.prix;
      }

      // Si l'utilisateur choisit le prix décroissant.
      if (sortOrder === "prix_desc") {
        // On trie du prix le plus grand au prix le plus petit.
        return b.prix - a.prix;
      }

      // Sinon, on trie par date de publication récente.
      return new Date(b.datePublication) - new Date(a.datePublication);
    });

  // On réinitialise tous les filtres.
  function resetFilters() {
    // On vide la recherche par nom.
    setSearchName("");

    // On vide la catégorie choisie.
    setSelectedCategory("");

    // On vide le prix minimum.
    setMinPrice("");

    // On vide le prix maximum.
    setMaxPrice("");

    // On remet le tri par défaut.
    setSortOrder("recent");
  }

  // On retourne la page.
  return (
    <>
      {/* On affiche la navbar. */}
      <Navbar />

      {/* Contenu principal. */}
      <main className="annonces-page">
        {/* En-tête de page. */}
        <section className="annonces-header">
          {/* Titre. */}
          <h1>Annonces disponibles</h1>

          {/* Description. */}
          <p>
            Découvrez les objets d’occasion publiés par les membres de SecondLife Market.
          </p>
        </section>

        {/* Message de chargement. */}
        {loading && (
          <p className="section-loading">
            Chargement des annonces...
          </p>
        )}

        {/* Message d'erreur. */}
        {error && (
          <p className="section-error" role="alert">
            {error}
          </p>
        )}

        {/* Bloc de recherche affiché seulement quand les annonces sont chargées. */}
        {!loading && !error && annonces.length > 0 && (
          <section className="annonce-search-box">
            {/* Champ pour rechercher par nom ou description. */}
            <div className="form-group">
              {/* Libellé du champ. */}
              <label>Rechercher un produit</label>

              {/* Champ de recherche. */}
              <input
                // Type texte.
                type="text"

                // Texte affiché avant la saisie.
                placeholder="Exemple : téléphone, chaussure, ordinateur..."

                // Valeur actuelle du champ.
                value={searchName}

                // Mise à jour du texte recherché.
                onChange={(event) => setSearchName(event.target.value)}
              />
            </div>

            {/* Filtre par catégorie. */}
            <div className="form-group">
              {/* Libellé du champ. */}
              <label>Catégorie</label>

              {/* Liste déroulante des catégories. */}
              <select
                // Valeur actuelle de la catégorie choisie.
                value={selectedCategory}

                // Mise à jour de la catégorie choisie.
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {/* Option par défaut pour afficher toutes les catégories. */}
                <option value="">Toutes les catégories</option>

                {/* On affiche les catégories disponibles. */}
                {categories.map((categorie) => (
                  // Option d'une catégorie.
                  <option key={categorie.id} value={categorie.id}>
                    {/* Nom de la catégorie. */}
                    {categorie.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre prix minimum. */}
            <div className="form-group">
              {/* Libellé du champ. */}
              <label>Prix minimum</label>

              {/* Champ numérique pour le prix minimum. */}
              <input
                // Type nombre.
                type="number"

                // On empêche les valeurs négatives.
                min="0"

                // Texte affiché avant la saisie.
                placeholder="Prix min"

                // Valeur actuelle du prix minimum.
                value={minPrice}

                // Mise à jour du prix minimum.
                onChange={(event) => setMinPrice(event.target.value)}
              />
            </div>

            {/* Filtre prix maximum. */}
            <div className="form-group">
              {/* Libellé du champ. */}
              <label>Prix maximum</label>

              {/* Champ numérique pour le prix maximum. */}
              <input
                // Type nombre.
                type="number"

                // On empêche les valeurs négatives.
                min="0"

                // Texte affiché avant la saisie.
                placeholder="Prix max"

                // Valeur actuelle du prix maximum.
                value={maxPrice}

                // Mise à jour du prix maximum.
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>

            {/* Sélecteur de tri. */}
            <div className="form-group">
              {/* Libellé du champ. */}
              <label>Trier par</label>

              {/* Liste déroulante pour choisir le tri. */}
              <select
                // Valeur actuelle du tri.
                value={sortOrder}

                // Mise à jour du tri.
                onChange={(event) => setSortOrder(event.target.value)}
              >
                {/* Tri par annonces récentes. */}
                <option value="recent">Plus récent</option>

                {/* Tri par prix croissant. */}
                <option value="prix_asc">Prix croissant</option>

                {/* Tri par prix décroissant. */}
                <option value="prix_desc">Prix décroissant</option>
              </select>
            </div>

            {/* Bouton pour vider tous les filtres. */}
            <div className="form-group">
              {/* Libellé invisible simple pour garder l'alignement. */}
              <label>Action</label>

              {/* Bouton de réinitialisation. */}
              <button
                // Type bouton pour éviter un submit.
                type="button"

                // Classe de style.
                className="btn btn-secondary"

                // Action au clic.
                onClick={resetFilters}
              >
                Réinitialiser
              </button>
            </div>
          </section>
        )}

        {/* Message si le prix minimum est supérieur au prix maximum. */}
        {prixInvalide && (
          <p className="section-error" role="alert">
            Le prix minimum ne peut pas être supérieur au prix maximum.
          </p>
        )}

        {/* Message si aucune annonce n'existe dans la base. */}
        {!loading && !error && annonces.length === 0 && (
          <p className="section-empty">
            Aucune annonce disponible pour le moment.
          </p>
        )}

        {/* Message si aucune annonce ne correspond aux filtres. */}
        {!loading && !error && annonces.length > 0 && filteredAnnonces.length === 0 && !prixInvalide && (
          <p className="section-empty">
            Aucune annonce ne correspond à votre recherche.
          </p>
        )}

        {/* Grille des annonces filtrées. */}
        {!loading && !error && filteredAnnonces.length > 0 && (
          <section className="products-grid">
            {/* On affiche chaque annonce filtrée. */}
            {filteredAnnonces.map((annonce) => (
              // Carte d'une annonce.
              <ProductCard key={annonce.id} annonce={annonce} />
            ))}
          </section>
        )}
      </main>

      {/* On affiche le footer. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default AnnoncesPage;