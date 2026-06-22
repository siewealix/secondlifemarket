// On importe Link pour créer des boutons de navigation.
import { Link } from "react-router-dom";

// On importe les icônes utiles.
import { Search, ShieldCheck, MapPin } from "lucide-react";

// On crée la grande section d'accueil.
function HeroSection() {
  // On retourne la section hero.
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

        {/* Zone de recherche principale. */}
        <div className="hero-search">
          {/* Icône de recherche. */}
          <Search size={22} />

          {/* Champ de recherche visuel. */}
          <input placeholder="Que recherchez-vous aujourd’hui ?" />

          {/* Bouton de recherche. */}
          <button>Rechercher</button>
        </div>

        {/* Zone des boutons principaux. */}
        <div className="hero-actions">
          {/* Bouton pour explorer les annonces. */}
          <Link to="/" className="btn btn-primary">Explorer les annonces</Link>

          {/* Bouton pour vendre un objet. */}
          <Link to="/" className="btn btn-outline">Vendre un objet</Link>
        </div>

        {/* Petites informations de confiance. */}
        <div className="hero-trust">
          {/* Premier élément de confiance. */}
          <span>+300 annonces publiées</span>

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