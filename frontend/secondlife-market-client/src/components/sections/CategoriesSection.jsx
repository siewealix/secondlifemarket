// On importe useEffect pour charger les catégories au démarrage.
import { useEffect } from "react";

// On importe useState pour stocker les catégories.
import { useState } from "react";

// On importe la fonction API qui récupère les catégories.
import { getActiveCategoriesRequest } from "../../api/categorieApi.js";

// On crée la section des catégories.
function CategoriesSection() {
  // On stocke la liste des catégories.
  const [categories, setCategories] = useState([]);

  // On stocke l'état de chargement.
  const [loading, setLoading] = useState(true);

  // On stocke une éventuelle erreur.
  const [error, setError] = useState("");

  // On charge les catégories au premier affichage du composant.
  useEffect(() => {
    // On crée une fonction interne pour charger les catégories.
    async function loadCategories() {
      // On essaie de récupérer les catégories.
      try {
        // On appelle l'API backend.
        const data = await getActiveCategoriesRequest();

        // On stocke les catégories reçues.
        setCategories(data);

        // On vide l'erreur si tout fonctionne.
        setError("");
      } catch (requestError) {
        // On affiche une erreur simple.
        setError(requestError.message);
      } finally {
        // On arrête le chargement.
        setLoading(false);
      }
    }

    // On lance le chargement des catégories.
    loadCategories();
  }, []);

  // On retourne la section complète.
  return (
    // Section standard de la page.
    <section className="home-section">
      {/* En-tête de section. */}
      <div className="section-header">
        {/* Titre de la section. */}
        <h2>Catégories populaires</h2>

        {/* Description courte. */}
        <p>Trouvez rapidement le type d’objet que vous recherchez.</p>
      </div>

      {/* On affiche un message pendant le chargement. */}
      {loading && (
        // Message visible pendant le chargement.
        <p className="section-loading">Chargement des catégories...</p>
      )}

      {/* On affiche une erreur si le chargement échoue. */}
      {error && (
        // Message d'erreur accessible.
        <p className="section-error" role="alert">
          {/* Texte de l'erreur. */}
          {error}
        </p>
      )}

      {/* On affiche un message si aucune catégorie n'existe. */}
      {!loading && !error && categories.length === 0 && (
        // Message quand la liste est vide.
        <p className="section-empty">Aucune catégorie disponible pour le moment.</p>
      )}

      {/* On affiche la grille seulement si les catégories existent. */}
      {!loading && !error && categories.length > 0 && (
        // Grille des catégories.
        <div className="categories-grid">
          {/* On parcourt les catégories reçues du backend. */}
          {categories.map((category) => (
            // Carte d'une catégorie.
            <div className="category-card" key={category.id}>
              {/* Icône de la catégorie. */}
              <span>{category.icone || "📦"}</span>

              {/* Nom de la catégorie. */}
              <strong>{category.nom}</strong>

              {/* Description courte de la catégorie. */}
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// On exporte la section des catégories.
export default CategoriesSection;