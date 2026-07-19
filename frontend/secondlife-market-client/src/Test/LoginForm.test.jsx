// On importe render pour afficher le composant.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe userEvent pour simuler les actions de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe MemoryRouter pour simuler la navigation.
import { MemoryRouter } from "react-router-dom";

// On importe Routes et Route pour créer de fausses pages pendant le test.
import { Route, Routes } from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe le formulaire de connexion à tester.
import LoginForm from "../components/forms/LoginForm.jsx";

// On regroupe les tests du formulaire de connexion.
describe("LoginForm", () => {
  // Premier test.
  it("affiche le formulaire de connexion vide", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // =========================
    // ACT : Action
    // =========================

    // On affiche le formulaire dans un routeur et un contexte d'authentification.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <LoginForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton de connexion.
    const submitButton = screen.getByRole("button", {
      name: "Se connecter",
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ email est affiché.
    expect(emailInput).toBeInTheDocument();

    // On vérifie que le champ email est vide.
    expect(emailInput).toHaveValue("");

    // On vérifie que le champ mot de passe est affiché.
    expect(passwordInput).toBeInTheDocument();

    // On vérifie que le champ mot de passe est vide.
    expect(passwordInput).toHaveValue("");

    // On vérifie que le bouton de connexion est affiché.
    expect(submitButton).toBeInTheDocument();

    // On vérifie que le bouton est désactivé.
    expect(submitButton).toBeDisabled();

    // On vérifie que le lien vers l'inscription est affiché.
    expect(
      screen.getByRole("link", {
        name: "Créer un compte",
      }),
    ).toBeInTheDocument();
  });

  // Deuxième test.
  it("refuse une adresse email invalide", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On affiche le formulaire.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <LoginForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton de connexion.
    const submitButton = screen.getByRole("button", {
      name: "Se connecter",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit une adresse email invalide.
    await user.type(emailInput, "adresse-invalide");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On quitte le champ mot de passe pour déclencher la validation.
    await user.tab();

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le message d'erreur de l'email est affiché.
    expect(
      await screen.findByText(
        "Veuillez saisir une adresse email valide.",
      ),
    ).toBeInTheDocument();

    // On vérifie que le bouton reste désactivé.
    expect(submitButton).toBeDisabled();

    // On vérifie que la fonction de connexion n'a pas été appelée.
    expect(loginMock).not.toHaveBeenCalled();
  });

    // Troisième test.
  it("refuse un mot de passe qui ne respecte pas les règles", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <LoginForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton de connexion.
    const submitButton = screen.getByRole("button", {
      name: "Se connecter",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit un mot de passe trop faible.
    await user.type(passwordInput, "alix123");

    // On quitte le champ afin d'afficher son erreur.
    await user.tab();

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le message d'erreur du mot de passe est affiché.
    expect(
      await screen.findByText(
        "Le mot de passe ne respecte pas encore toutes les conditions.",
      ),
    ).toBeInTheDocument();

    // On vérifie que le bouton de connexion reste désactivé.
    expect(submitButton).toBeDisabled();

    // On vérifie que la fonction de connexion n'a pas été appelée.
    expect(loginMock).not.toHaveBeenCalled();
  });

    // Quatrième test.
  it("connecte un membre et le redirige vers son espace", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On indique que la connexion réussit avec un membre.
    loginMock.mockResolvedValue({
      // On prépare l'identifiant du membre.
      id: 1,

      // On prépare son nom.
      nom: "Siewe",

      // On prépare son prénom.
      prenom: "Alix",

      // On prépare son adresse email.
      email: "alix@test.com",

      // On indique que son rôle est Membre.
      role: "Membre",
    });

    // On affiche le formulaire avec de fausses routes.
    render(
      <MemoryRouter initialEntries={["/connexion"]}>
        <AuthContext.Provider value={{ login: loginMock }}>
          <Routes>
            <Route
              path="/connexion"
              element={<LoginForm />}
            />

            <Route
              path="/membre"
              element={<h1>Espace membre</h1>}
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton de connexion.
    const submitButton = screen.getByRole("button", {
      name: "Se connecter",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On clique sur le bouton de connexion.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction login a été appelée une seule fois.
    expect(loginMock).toHaveBeenCalledTimes(1);

    // On vérifie que la fonction login a reçu les bonnes informations.
    expect(loginMock).toHaveBeenCalledWith({
      email: "alix@test.com",
      password: "SecondLife@2026",
    });

    // On vérifie que la page membre est maintenant affichée.
    expect(
      await screen.findByRole("heading", {
        name: "Espace membre",
      }),
    ).toBeInTheDocument();
  });

    // Cinquième test.
  it("connecte un administrateur et le redirige vers son espace", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On indique que la connexion réussit avec un administrateur.
    loginMock.mockResolvedValue({
      // On prépare l'identifiant de l'administrateur.
      id: 2,

      // On prépare son nom.
      nom: "Admin",

      // On prépare son prénom.
      prenom: "SecondLife",

      // On prépare son adresse email.
      email: "admin@test.com",

      // On indique que son rôle est Administrateur.
      role: "Administrateur",
    });

    // On affiche le formulaire avec de fausses routes.
    render(
      <MemoryRouter initialEntries={["/connexion"]}>
        <AuthContext.Provider value={{ login: loginMock }}>
          <Routes>
            <Route
              path="/connexion"
              element={<LoginForm />}
            />

            <Route
              path="/admin"
              element={<h1>Espace administrateur</h1>}
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton de connexion.
    const submitButton = screen.getByRole("button", {
      name: "Se connecter",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit l'adresse email de l'administrateur.
    await user.type(emailInput, "admin@test.com");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On clique sur le bouton de connexion.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction login a été appelée une seule fois.
    expect(loginMock).toHaveBeenCalledTimes(1);

    // On vérifie que login a reçu les bonnes informations.
    expect(loginMock).toHaveBeenCalledWith({
      email: "admin@test.com",
      password: "SecondLife@2026",
    });

    // On vérifie que la page administrateur est affichée.
    expect(
      await screen.findByRole("heading", {
        name: "Espace administrateur",
      }),
    ).toBeInTheDocument();
  });

    // Sixième test.
  it("affiche le message d'erreur envoyé par le backend", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction de connexion.
    const loginMock = vi.fn();

    // On indique que la connexion va échouer.
    loginMock.mockRejectedValue(
      // On prépare le message d'erreur envoyé par le backend.
      new Error("Email ou mot de passe incorrect."),
    );

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <LoginForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton de connexion.
    const submitButton = screen.getByRole("button", {
      name: "Se connecter",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On clique sur le bouton de connexion.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction login a été appelée une seule fois.
    expect(loginMock).toHaveBeenCalledTimes(1);

    // On vérifie que les bonnes informations ont été envoyées.
    expect(loginMock).toHaveBeenCalledWith({
      email: "alix@test.com",
      password: "SecondLife@2026",
    });

    // On recherche le message d'erreur accessible.
    const errorMessage = await screen.findByRole("alert");

    // On vérifie que le message du backend est affiché.
    expect(errorMessage).toHaveTextContent(
      "Email ou mot de passe incorrect.",
    );
  });


});