// On importe Link pour naviguer sans recharger la page.
import { Link } from "react-router-dom";

// On importe la barre de navigation.
import Navbar from "../../components/layout/Navbar.jsx";

// On importe le pied de page.
import Footer from "../../components/layout/Footer.jsx";

// On utilise exactement la même clé que CookieBanner.jsx.
const COOKIE_CHOICE_KEY = "secondlife_cookie_choice";

// On crée la page de confidentialité.
function ConfidentialitePage() {
  // Cette fonction permet de modifier le choix concernant les cookies.
  function resetCookieChoice() {
    // On supprime l’ancien choix enregistré dans le navigateur.
    localStorage.removeItem(COOKIE_CHOICE_KEY);

    // On recharge la page pour afficher de nouveau la bannière.
    window.location.reload();
  }

  // On retourne le contenu de la page.
  return (
    // On regroupe les éléments sans ajouter de balise inutile.
    <>
      {/* On affiche la barre de navigation. */}
      <Navbar />

      {/* On crée le contenu principal de la page. */}
      <main className="information-page">
        {/* On crée la carte contenant la politique de confidentialité. */}
        <article className="information-card legal-page">
          {/* On crée l’en-tête de la page. */}
          <header className="legal-header">
            {/* On affiche le titre principal. */}
            <h1>Politique de confidentialité</h1>

            {/* On indique la date de mise à jour. */}
            <p className="legal-update">
              Dernière mise à jour : 15 juillet 2026
            </p>

            {/* On présente l’objectif de la page. */}
            <p className="legal-introduction">
              Cette politique explique quelles informations sont utilisées par
              SecondLife Market, pourquoi elles sont utilisées et comment les
              utilisateurs peuvent exercer leurs droits.
            </p>
          </header>

          {/* On explique qui gère les données. */}
          <section className="legal-section">
            <h2>1. Responsable des données</h2>

            <p>
              Dans le cadre de ce projet, SecondLife Market gère les données
              nécessaires au fonctionnement de la plateforme.
            </p>

            <p>
              Toute question concernant les données personnelles peut être
              envoyée depuis notre{" "}
              <Link to="/contact" className="legal-link">
                formulaire de contact
              </Link>
              .
            </p>
          </section>

          {/* On présente les données du compte. */}
          <section className="legal-section">
            <h2>2. Données collectées</h2>

            <p>
              Les données collectées dépendent des fonctionnalités utilisées.
              Elles peuvent notamment comprendre :
            </p>

            <ul>
              <li>le nom et le prénom ;</li>

              <li>l’adresse e-mail et le numéro de téléphone ;</li>

              <li>les informations nécessaires à l’authentification ;</li>

              <li>
                les titres, descriptions, prix, catégories et photos des
                annonces ;
              </li>

              <li>les demandes d’achat et les signalements effectués ;</li>

              <li>
                le nom, l’adresse e-mail, le sujet et le message envoyés depuis
                le formulaire de contact ;
              </li>

              <li>le choix effectué dans la bannière de cookies.</li>
            </ul>
          </section>

          {/* On explique pourquoi les données sont utilisées. */}
          <section className="legal-section">
            <h2>3. Utilisation des données</h2>

            <p>Les données sont utilisées pour :</p>

            <ul>
              <li>créer et gérer les comptes utilisateurs ;</li>

              <li>permettre la connexion sécurisée à la plateforme ;</li>

              <li>publier, modifier et consulter les annonces ;</li>

              <li>faciliter les échanges entre les utilisateurs ;</li>

              <li>traiter les demandes envoyées depuis le formulaire ;</li>

              <li>examiner les annonces et les signalements ;</li>

              <li>prévenir les abus et protéger la plateforme.</li>
            </ul>
          </section>

          {/* On explique les raisons autorisant l’utilisation des données. */}
          <section className="legal-section">
            <h2>4. Raisons du traitement</h2>

            <p>
              Les données nécessaires au compte et aux annonces sont utilisées
              pour fournir les services demandés par l’utilisateur.
            </p>

            <p>
              Certaines données peuvent également être utilisées pour assurer
              la sécurité de la plateforme, prévenir les fraudes et traiter les
              signalements.
            </p>

            <p>
              Lorsque le consentement de l’utilisateur est nécessaire, celui-ci
              peut accepter ou refuser le traitement concerné.
            </p>
          </section>

          {/* On explique qui peut accéder aux données. */}
          <section className="legal-section">
            <h2>5. Accès aux données</h2>

            <p>
              Les données sont accessibles uniquement aux personnes qui en ont
              besoin pour assurer le fonctionnement, l’administration ou la
              modération de SecondLife Market.
            </p>

            <p>
              Les informations personnelles des utilisateurs ne sont pas
              destinées à être vendues.
            </p>
          </section>

          {/* On explique la durée de conservation. */}
          <section className="legal-section">
            <h2>6. Durée de conservation</h2>

            <p>
              Les données sont conservées uniquement pendant la durée nécessaire
              à la réalisation de leur objectif.
            </p>

            <ul>
              <li>
                Les données du compte sont conservées tant que le compte est
                actif.
              </li>

              <li>
                Les annonces sont conservées pendant leur publication, puis
                peuvent être archivées ou supprimées.
              </li>

              <li>
                Les messages de contact sont conservés le temps nécessaire au
                traitement de la demande.
              </li>

              <li>
                Certaines informations peuvent être conservées plus longtemps
                lorsqu’elles sont nécessaires à la sécurité ou au respect
                d’une obligation applicable.
              </li>
            </ul>
          </section>

          {/* On explique le fonctionnement des cookies. */}
          <section className="legal-section">
            <h2>7. Cookies et stockage local</h2>

            <p>
              SecondLife Market peut utiliser un cookie technique nécessaire au
              maintien sécurisé de la session d’un utilisateur connecté.
            </p>

            <p>
              Le choix effectué dans la bannière est enregistré dans le stockage
              local du navigateur sous la clé{" "}
              <strong>secondlife_cookie_choice</strong>. Cette information
              évite d’afficher la bannière à chaque visite.
            </p>

            <p>
              Le choix peut être modifié à tout moment en utilisant le bouton
              suivant :
            </p>

            {/* Ce bouton supprime l’ancien choix de cookies. */}
            <button
              type="button"
              className="legal-action-button"
              onClick={resetCookieChoice}
            >
              Modifier mon choix de cookies
            </button>
          </section>

          {/* On présente les mesures de sécurité. */}
          <section className="legal-section">
            <h2>8. Sécurité des données</h2>

            <p>
              SecondLife Market utilise des mesures techniques destinées à
              protéger les comptes et les informations enregistrées.
            </p>

            <ul>
              <li>les mots de passe sont protégés côté serveur ;</li>

              <li>l’accès aux fonctionnalités dépend du rôle de l’utilisateur ;</li>

              <li>les routes sensibles nécessitent une authentification ;</li>

              <li>
                les comptes abusifs peuvent être suspendus par un administrateur.
              </li>
            </ul>

            <p>
              Aucun système informatique ne pouvant garantir une sécurité
              absolue, les utilisateurs doivent également protéger leurs
              identifiants de connexion.
            </p>
          </section>

          {/* On présente les droits des utilisateurs. */}
          <section className="legal-section">
            <h2>9. Droits des utilisateurs</h2>

            <p>
              Selon la réglementation applicable, un utilisateur peut demander :
            </p>

            <ul>
              <li>l’accès à ses données ;</li>

              <li>la correction de données inexactes ;</li>

              <li>la suppression de ses données ;</li>

              <li>la limitation de leur utilisation ;</li>

              <li>l’opposition à certains traitements ;</li>

              <li>la récupération des données qu’il a fournies.</li>
            </ul>

            <p>
              Ces demandes peuvent être envoyées depuis notre{" "}
              <Link to="/contact" className="legal-link">
                formulaire de contact
              </Link>
              .
            </p>
          </section>

          {/* On explique que la politique peut évoluer. */}
          <section className="legal-section">
            <h2>10. Modification de la politique</h2>

            <p>
              Cette politique peut être modifiée lorsque les fonctionnalités ou
              les traitements de SecondLife Market évoluent. La date de la
              dernière mise à jour est affichée en haut de la page.
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
export default ConfidentialitePage;