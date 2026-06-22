// On importe quelques icônes modernes.
import { Search, MessageCircle, Handshake } from "lucide-react";

// On crée les étapes de fonctionnement.
const steps = [
  // Étape 1.
  {
    id: 1,
    title: "Recherchez un objet",
    text: "Parcourez les annonces et trouvez l’objet qui correspond à votre besoin.",
    icon: Search
  },

  // Étape 2.
  {
    id: 2,
    title: "Envoyez une demande",
    text: "Connectez-vous et envoyez une demande d’achat au vendeur.",
    icon: MessageCircle
  },

  // Étape 3.
  {
    id: 3,
    title: "Échangez simplement",
    text: "Discutez avec le vendeur et finalisez la transaction hors application.",
    icon: Handshake
  }
];

// On crée la section Comment ça marche.
function HowItWorksSection() {
  // On retourne la section.
  return (
    // Section avec fond bleu très léger.
    <section className="home-section how-section">
      {/* En-tête de section. */}
      <div className="section-header">
        {/* Titre. */}
        <h2>Comment ça marche ?</h2>

        {/* Texte court. */}
        <p>Une expérience simple, claire et adaptée aux achats locaux.</p>
      </div>

      {/* Grille des étapes. */}
      <div className="steps-grid">
        {/* On parcourt les étapes. */}
        {steps.map((step) => {
          // On récupère l'icône de l'étape.
          const Icon = step.icon;

          // On retourne une carte d'étape.
          return (
            // Carte d'étape.
            <div className="step-card" key={step.id}>
              {/* Cercle avec icône. */}
              <div className="step-icon">
                {/* Icône de l'étape. */}
                <Icon size={28} />
              </div>

              {/* Titre de l'étape. */}
              <h3>{step.title}</h3>

              {/* Description de l'étape. */}
              <p>{step.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// On exporte la section.
export default HowItWorksSection;