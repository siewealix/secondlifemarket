// On importe Link pour naviguer sans recharger la page.
import { Link } from "react-router-dom";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// On crée la page d’accessibilité.
function AccessibilitePage() {
  // On retourne le contenu de la page.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On crée le contenu principal de la page. */}
      <main className="information-page">
        {/* On crée la carte contenant les informations d’accessibilité. */}
        <article className="information-card legal-page">
          {/* On crée l’en-tête de la page. */}
          <header className="legal-header">
            {/* On affiche le titre principal. */}
            <h1>Accessibilité numérique</h1>

            {/* On indique la date de mise à jour. */}
            <p className="legal-update">
              Dernière mise à jour : 15 juillet 2026
            </p>

            {/* On présente l’objectif de la page. */}
            <p className="legal-introduction">
              SecondLife Market souhaite proposer une plateforme simple,
              compréhensible et utilisable par le plus grand nombre, y compris
              par les personnes en situation de handicap.
            </p>
          </header>

          {/* On présente honnêtement l’état actuel du projet. */}
          <aside
            className="accessibility-status"
            aria-labelledby="accessibility-status-title"
          >
            {/* On affiche le titre de l’encadré. */}
            <h2 id="accessibility-status-title">
              État actuel de l’accessibilité
            </h2>

            {/* On précise qu’aucun audit complet n’a encore été effectué. */}
            <p>
              SecondLife Market n’a pas encore fait l’objet d’un audit complet
              selon le RGAA. Son niveau de conformité ne peut donc pas encore
              être officiellement déterminé.
            </p>
          </aside>

          {/* On explique l’engagement du projet. */}
          <section className="legal-section">
            <h2>1. Notre engagement</h2>

            <p>
              L’accessibilité est prise en compte progressivement pendant le
              développement de SecondLife Market.
            </p>

            <p>
              Le Référentiel général d’amélioration de l’accessibilité, appelé
              RGAA, est utilisé comme référence pour identifier les
              améliorations à apporter à l’interface.
            </p>
          </section>

          {/* On présente les mesures déjà mises en place. */}
          <section className="legal-section">
            <h2>2. Mesures déjà mises en place</h2>

            <p>
              Plusieurs bonnes pratiques sont déjà utilisées dans
              l’application :
            </p>

            <ul>
              <li>
                utilisation de balises HTML structurées comme
                <strong> nav</strong>, <strong>main</strong>,
                <strong> section</strong> et <strong>footer</strong> ;
              </li>

              <li>
                association des champs de formulaire à leurs étiquettes avec
                <strong> htmlFor</strong> et <strong>id</strong> ;
              </li>

              <li>
                utilisation de boutons et de liens accessibles au clavier ;
              </li>

              <li>affichage visible du focus sur les éléments interactifs ;</li>

              <li>
                utilisation de messages d’erreur et de confirmation
                compréhensibles ;
              </li>

              <li>
                ajout de textes alternatifs aux images importantes ;
              </li>

              <li>
                adaptation de l’interface aux téléphones, tablettes et
                ordinateurs ;
              </li>

              <li>
                utilisation des attributs ARIA lorsque leur présence est
                nécessaire.
              </li>
            </ul>
          </section>

          {/* On présente les améliorations restantes. */}
          <section className="legal-section">
            <h2>3. Améliorations encore nécessaires</h2>

            <p>
              Certaines vérifications doivent encore être réalisées avant de
              pouvoir annoncer un niveau de conformité.
            </p>

            <ul>
              <li>vérifier tous les contrastes de couleurs ;</li>

              <li>tester tous les parcours uniquement au clavier ;</li>

              <li>tester les pages avec un lecteur d’écran ;</li>

              <li>vérifier tous les textes alternatifs des images ;</li>

              <li>contrôler l’ordre des titres dans chaque page ;</li>

              <li>
                vérifier les messages d’erreur de tous les formulaires ;
              </li>

              <li>
                réaliser un audit complet selon les critères du RGAA.
              </li>
            </ul>
          </section>

          {/* On explique comment naviguer dans l’application. */}
          <section className="legal-section">
            <h2>4. Navigation au clavier</h2>

            <p>
              Les principaux liens, champs et boutons peuvent être parcourus
              avec la touche <strong>Tabulation</strong>.
            </p>

            <p>
              La combinaison <strong>Majuscule + Tabulation</strong> permet de
              revenir à l’élément précédent, tandis que la touche
              <strong> Entrée</strong> permet généralement d’activer un lien ou
              un bouton.
            </p>
          </section>

          {/* On explique comment signaler une difficulté. */}
          <section className="legal-section">
            <h2>5. Signaler un problème d’accessibilité</h2>

            <p>
              Si vous ne parvenez pas à accéder à une information ou à utiliser
              une fonctionnalité, vous pouvez nous le signaler depuis notre{" "}
              <Link to="/contact" className="legal-link">
                formulaire de contact
              </Link>
              .
            </p>

            <p>
              Pour faciliter la correction, vous pouvez préciser la page
              concernée, le problème rencontré, votre navigateur et
              éventuellement la technologie d’assistance utilisée.
            </p>
          </section>

          {/* On explique que cette page sera actualisée. */}
          <section className="legal-section">
            <h2>6. Mise à jour de cette page</h2>

            <p>
              Cette page sera mise à jour au fur et à mesure des corrections,
              des tests et des futurs audits réalisés sur SecondLife Market.
            </p>
          </section>
        </article>
      </main>

      {/* On affiche le pied de page. */}
      <Footer />
    </>
  );
}

// On exporte la page.
export default AccessibilitePage;