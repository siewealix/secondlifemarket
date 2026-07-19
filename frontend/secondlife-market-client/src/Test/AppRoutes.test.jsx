// On importe render pour afficher les composants.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe userEvent pour simuler les clics de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe MemoryRouter pour simuler la navigation.
import { MemoryRouter } from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe les routes réelles de l'application.
import AppRoutes from "../routes/AppRoutes.jsx";

// On regroupe les tests d'intégration des routes.
describe("AppRoutes", () => {
  // Premier test d'intégration.
  it("navigue entre la connexion et l'inscription", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On prépare les fausses informations d'authentification.
    const authValue = {
      // On fournit la fonction de connexion.
      login: loginMock,

      // On fournit la fonction d'inscription.
      register: registerMock,

      // On indique que personne n'est connecté.
      user: null,

      // On indique que l'utilisateur n'est pas authentifié.
      isAuthenticated: false,

      // On indique que la session n'est pas en chargement.
      loading: false,
    };

    // On affiche les routes réelles de l'application.
    render(
      <MemoryRouter initialEntries={["/connexion"]}>
        <AuthContext.Provider value={authValue}>
          <AppRoutes />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // =========================
    // ACT ET ASSERT
    // Première navigation
    // =========================

    // On vérifie que la page de connexion est affichée.
    expect(
      screen.getByRole("heading", {
        name: "Connexion",
      }),
    ).toBeInTheDocument();

    // On recherche le lien vers l'inscription.
    const registerLink = screen.getByRole("link", {
      name: "Créer un compte",
    });

    // On clique sur le lien Créer un compte.
    await user.click(registerLink);

    // On vérifie que la page d'inscription est affichée.
    expect(
      await screen.findByRole("heading", {
        name: "Créer un compte",
      }),
    ).toBeInTheDocument();

    // =========================
    // ACT ET ASSERT
    // Deuxième navigation
    // =========================

    // On recherche le lien permettant de revenir à la connexion.
    const loginLink = screen.getByRole("link", {
      name: "Se connecter",
    });

    // On clique sur le lien Se connecter.
    await user.click(loginLink);

    // On vérifie que la page de connexion est de nouveau affichée.
    expect(
      await screen.findByRole("heading", {
        name: "Connexion",
      }),
    ).toBeInTheDocument();

    // On vérifie qu'aucune connexion n'a été effectuée.
    expect(loginMock).not.toHaveBeenCalled();

    // On vérifie qu'aucune inscription n'a été effectuée.
    expect(registerMock).not.toHaveBeenCalled();
  });

    // Deuxième test d'intégration.
  it("redirige un visiteur non connecté vers la page de connexion", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On prépare un contexte représentant un visiteur non connecté.
    const authValue = {
      // Aucun utilisateur n'est connecté.
      user: null,

      // Aucun token d'accès n'est disponible.
      accessToken: null,

      // L'utilisateur n'est pas authentifié.
      isAuthenticated: false,

      // La vérification de la session est terminée.
      loading: false,

      // On fournit la fausse fonction de connexion.
      login: loginMock,

      // On fournit la fausse fonction d'inscription.
      register: registerMock,

      // On crée une fausse fonction de déconnexion.
      logout: vi.fn(),
    };

    // =========================
    // ACT : Action
    // =========================

    // On ouvre directement la route protégée /membre.
    render(
      <MemoryRouter initialEntries={["/membre"]}>
        <AuthContext.Provider value={authValue}>
          <AppRoutes />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le visiteur est redirigé vers la page de connexion.
    expect(
      await screen.findByRole("heading", {
        name: "Connexion",
      }),
    ).toBeInTheDocument();

    // On vérifie que le formulaire de connexion est affiché.
    expect(
      screen.getByRole("button", {
        name: "Se connecter",
      }),
    ).toBeInTheDocument();

    // On vérifie que la fonction de connexion n'a pas été appelée.
    expect(loginMock).not.toHaveBeenCalled();

    // On vérifie que la fonction d'inscription n'a pas été appelée.
    expect(registerMock).not.toHaveBeenCalled();
  });



});