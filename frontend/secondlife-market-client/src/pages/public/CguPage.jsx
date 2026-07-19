// On importe Link pour naviguer sans recharger la page.
import { Link } from "react-router-dom";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// On crée la page des conditions générales d’utilisation.
function CguPage() {
  // On retourne le contenu de la page.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On crée le contenu principal de la page. */}
      <main className="information-page">
        {/* On crée la carte contenant les CGU. */}
        <article className="information-card legal-page">
          {/* On crée l’en-tête de la page. */}
          <header className="legal-header">
            {/* On affiche le titre principal. */}
            <h1>Conditions générales d’utilisation</h1>

            {/* On indique la date de mise à jour. */}
            <p className="legal-update">
              Dernière mise à jour : 15 juillet 2026
            </p>

            {/* On présente rapidement le document. */}
            <p className="legal-introduction">
              Les présentes conditions générales d’utilisation définissent les
              règles applicables à l’utilisation de SecondLife Market.
            </p>
          </header>

          {/* On explique l’objet des CGU. */}
          <section className="legal-section">
            <h2>1. Objet de la plateforme</h2>

            <p>
              SecondLife Market est une plateforme permettant aux utilisateurs
              de consulter, publier, acheter et vendre des objets d’occasion.
              Elle facilite la mise en relation entre les personnes intéressées
              par ces objets.
            </p>
          </section>

          {/* On explique l’acceptation des règles. */}
          <section className="legal-section">
            <h2>2. Acceptation des conditions</h2>

            <p>
              L’utilisation de SecondLife Market implique l’acceptation des
              présentes conditions. L’utilisateur s’engage à les respecter
              pendant toute la durée d’utilisation de la plateforme.
            </p>
          </section>

          {/* On explique les règles relatives au compte. */}
          <section className="legal-section">
            <h2>3. Création et utilisation du compte</h2>

            <p>
              Certaines fonctionnalités nécessitent la création d’un compte.
              L’utilisateur doit fournir des informations exactes et maintenir
              ses informations à jour.
            </p>

            <ul>
              <li>Chaque utilisateur doit utiliser sa propre identité.</li>

              <li>
                Les identifiants de connexion doivent rester confidentiels.
              </li>

              <li>
                Toute activité réalisée depuis un compte relève de la
                responsabilité de son titulaire.
              </li>

              <li>
                Toute utilisation frauduleuse doit être signalée rapidement.
              </li>
            </ul>
          </section>

          {/* On explique les règles de publication. */}
          <section className="legal-section">
            <h2>4. Publication des annonces</h2>

            <p>
              L’utilisateur qui publie une annonce doit présenter l’objet de
              manière honnête, claire et suffisamment précise.
            </p>

            <p>Il est notamment interdit de publier :</p>

            <ul>
              <li>un objet interdit ou dangereux ;</li>

              <li>une annonce mensongère ou trompeuse ;</li>

              <li>un contenu injurieux, violent ou discriminatoire ;</li>

              <li>des images ou textes appartenant à une autre personne ;</li>

              <li>plusieurs annonces destinées à tromper les utilisateurs.</li>
            </ul>
          </section>

          {/* On explique les responsabilités pendant une transaction. */}
          <section className="legal-section">
            <h2>5. Relations entre les utilisateurs</h2>

            <p>
              SecondLife Market facilite la mise en relation entre les
              utilisateurs. Chaque utilisateur reste responsable de ses
              annonces, de ses échanges et des objets qu’il propose.
            </p>

            <p>
              Avant de conclure une transaction, les utilisateurs doivent
              vérifier l’état de l’objet, son prix ainsi que les modalités de
              paiement et de remise.
            </p>
          </section>

          {/* On explique le fonctionnement de la modération. */}
          <section className="legal-section">
            <h2>6. Modération et suspension</h2>

            <p>
              SecondLife Market peut examiner les annonces et les signalements
              afin de protéger les utilisateurs et le bon fonctionnement de la
              plateforme.
            </p>

            <p>
              Une annonce peut être masquée ou supprimée lorsqu’elle ne respecte
              pas les présentes conditions. Un compte peut également être
              suspendu en cas d’abus, de fraude ou de violations répétées.
            </p>
          </section>

          {/* On explique les droits concernant les contenus. */}
          <section className="legal-section">
            <h2>7. Propriété intellectuelle</h2>

            <p>
              Les textes, éléments graphiques, logos et composants propres à
              SecondLife Market ne peuvent pas être copiés ou réutilisés sans
              autorisation.
            </p>

            <p>
              L’utilisateur reste responsable des textes et des images qu’il
              ajoute dans ses annonces.
            </p>
          </section>

          {/* On explique les limites techniques du service. */}
          <section className="legal-section">
            <h2>8. Disponibilité du service</h2>

            <p>
              SecondLife Market peut être temporairement indisponible en raison
              d’une maintenance, d’une mise à jour ou d’un problème technique.
              Des efforts sont réalisés pour rétablir le service dans les
              meilleurs délais.
            </p>
          </section>

          {/* On renvoie vers la future page de confidentialité. */}
          <section className="legal-section">
            <h2>9. Données personnelles</h2>

            <p>
              Les informations concernant la collecte et l’utilisation des
              données personnelles sont présentées dans la{" "}
              <Link to="/confidentialite" className="legal-link">
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          {/* On explique que les conditions peuvent évoluer. */}
          <section className="legal-section">
            <h2>10. Modification des conditions</h2>

            <p>
              Les présentes conditions peuvent être mises à jour afin de tenir
              compte de l’évolution de la plateforme. La date de la dernière
              modification est affichée en haut de cette page.
            </p>
          </section>

          {/* On indique comment contacter la plateforme. */}
          <section className="legal-section">
            <h2>11. Nous contacter</h2>

            <p>
              Pour toute question concernant ces conditions, utilisez notre{" "}
              <Link to="/contact" className="legal-link">
                formulaire de contact
              </Link>
              .
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
export default CguPage;