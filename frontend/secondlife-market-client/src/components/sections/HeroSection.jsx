// On importe Link pour créer des boutons de navigation.
import { Link, useNavigate } from "react-router-dom";

// On importe useState pour mémoriser le texte recherché.
import { useState } from "react";

// On importe les icônes utiles.
import { Search, ShieldCheck, MapPin } from "lucide-react";


// On crée la grande section d'accueil.
function HeroSection() {
  // On retourne la section hero.
  // On prépare la fonction qui permet de changer de page.
  const navigate = useNavigate();

  // On mémorise le texte saisi dans la barre de recherche.
  const [searchText, setSearchText] = useState("");

  // Cette fonction sera exécutée lorsque l’utilisateur lance la recherche.
  function handleSearch(event) {
    // On empêche le rechargement complet de la page.
    event.preventDefault();

    // On supprime les espaces inutiles.
    const texteNettoye = searchText.trim();

    // On vérifie si le champ est vide.
    if (texteNettoye === "") {
      // On ouvre simplement la page de toutes les annonces.
      navigate("/annonces");

      // On arrête la fonction.
      return;
    }

    // On ouvre la page des annonces avec le texte recherché dans l’URL.
    navigate(
      `/annonces?recherche=${encodeURIComponent(texteNettoye)}`
    );
  }
  return (
    // section représente une partie importante de la page.
    <section className="hero-section">
      {/* Cette div contient le texte principal. */}
      <div className="hero-content">
        {/* Petit badge de confiance. */}
        <div className="hero-badge">
          {/* Icône de sécurité. */}
          <ShieldCheck size={18} />

          {/* Texte du badge. */}
          <span>Marketplace simple, locale et rassurante</span>
        </div>

        {/* Grand titre de la page d'accueil. */}
        <h1>Achetez et vendez vos objets d’occasion en toute simplicité</h1>

        {/* Texte explicatif sous le titre. */}
        <p>
          Découvrez des objets utiles près de chez vous, contactez les vendeurs
          et donnez une seconde vie aux biens du quotidien.
        </p>

        {/* On crée un formulaire de recherche. */}
        <form
          className="hero-search"
          onSubmit={handleSearch}
        >
          {/* On affiche l’icône de recherche. */}
          <Search size={22} />

          {/* On crée le champ dans lequel l’utilisateur écrit sa recherche. */}
          <input
            type="text"
            placeholder="Que recherchez-vous aujourd’hui ?"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          {/* Ce bouton envoie le formulaire. */}
          <button type="submit">
            Rechercher
          </button>
        </form>

        {/* On crée la zone qui contient les deux boutons principaux. */}
        <div className="hero-actions">

          {/* Ce lien permet d’ouvrir la page de toutes les annonces. */}
          <Link
            to="/annonces"
            className="btn btn-primary"
          >
            {/* Texte affiché dans le premier bouton. */}
            Explorer les annonces
          </Link>

          {/* Ce lien permet d’ouvrir le formulaire de création d’une annonce. */}
          <Link
            to="/membre/vendeur/annonces/nouvelle"
            className="btn btn-outline"
          >
            {/* Texte affiché dans le deuxième bouton. */}
            Vendre un objet
          </Link>

        </div>

        {/* Petites informations de confiance. */}
        <div className="hero-trust">
          {/* Premier élément de confiance. */}
          <span>+100 annonces publiées</span>

          {/* Deuxième élément de confiance. */}
          <span>Prix en FCFA</span>

          {/* Troisième élément de confiance avec icône. */}
          <span><MapPin size={16} /> Ventes locales</span>
        </div>
      </div>

      {/* Cette div contient la partie visuelle à droite. */}
      <div className="hero-visual">
        {/* Carte principale avec image. */}
        <div className="hero-image-card">
          {/* Image moderne de marketplace. */}
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80"
            alt="Objets d'occasion"
          />

          {/* Carte flottante du prix. */}
          <div className="floating-price-card">
            {/* Texte court. */}
            <span>Objet populaire</span>

            {/* Prix en FCFA. */}
            <strong>185 000 FCFA</strong>
          </div>
        </div>

        {/* Petite carte flottante de confiance. */}
        <div className="floating-info-card">
          {/* Titre de la carte. */}
          <strong>Simple et rapide</strong>

          {/* Texte de la carte. */}
          <span>Publiez une annonce en quelques minutes</span>
        </div>
      </div>
    </section>
  );
}

// On exporte HeroSection.
export default HeroSection;