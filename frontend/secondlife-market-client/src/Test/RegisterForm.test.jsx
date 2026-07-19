// On importe render pour afficher le composant.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe userEvent pour simuler les actions de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe MemoryRouter pour simuler la navigation.
import { MemoryRouter } from "react-router-dom";

// On importe Route et Routes pour créer les fausses pages du test.
import { Route, Routes } from "react-router-dom";

// On importe le contexte d'authentification.
import { AuthContext } from "../context/AuthContext.jsx";

// On importe le formulaire d'inscription à tester.
import RegisterForm from "../components/forms/RegisterForm.jsx";

// On regroupe les tests du formulaire d'inscription.
describe("RegisterForm", () => {
  // Premier test.
  it("affiche le formulaire d'inscription vide", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // =========================
    // ACT : Action
    // =========================

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: registerMock }}>
          <RegisterForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ du nom.
    const lastNameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ du prénom.
    const firstNameInput = screen.getByLabelText(/^Prénom/i);

    // On recherche le champ de l'adresse email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ du téléphone.
    const phoneInput = screen.getByLabelText(/^Téléphone/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche le champ du mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le champ de confirmation.
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirmation du mot de passe/i,
    );

    // On recherche le bouton d'inscription.
    const submitButton = screen.getByRole("button", {
      name: "Créer mon compte",
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ du nom est affiché.
    expect(lastNameInput).toBeInTheDocument();

    // On vérifie que le champ du nom est vide.
    expect(lastNameInput).toHaveValue("");

    // On vérifie que le champ du prénom est affiché.
    expect(firstNameInput).toBeInTheDocument();

    // On vérifie que le champ du prénom est vide.
    expect(firstNameInput).toHaveValue("");

    // On vérifie que le champ de l'adresse email est vide.
    expect(emailInput).toHaveValue("");

    // On vérifie que le champ du téléphone est vide.
    expect(phoneInput).toHaveValue("");

    // On vérifie que le champ de la ville est vide.
    expect(cityInput).toHaveValue("");

    // On vérifie que le champ du mot de passe est vide.
    expect(passwordInput).toHaveValue("");

    // On vérifie que le champ de confirmation est vide.
    expect(confirmPasswordInput).toHaveValue("");

    // On vérifie que le bouton est affiché.
    expect(submitButton).toBeInTheDocument();

    // On vérifie que le bouton est désactivé.
    expect(submitButton).toBeDisabled();

    // On vérifie que le lien vers la connexion est affiché.
    expect(
      screen.getByRole("link", {
        name: "Se connecter",
      }),
    ).toBeInTheDocument();

    // On vérifie que la fonction d'inscription n'a pas été appelée.
    expect(registerMock).not.toHaveBeenCalled();
  });

  // Deuxième test.
  it("refuse une adresse email invalide", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: registerMock }}>
          <RegisterForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ du nom.
    const lastNameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ du prénom.
    const firstNameInput = screen.getByLabelText(/^Prénom/i);

    // On recherche le champ de l'adresse email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ du téléphone.
    const phoneInput = screen.getByLabelText(/^Téléphone/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche le champ du mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le champ de confirmation.
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirmation du mot de passe/i,
    );

    // On recherche le bouton d'inscription.
    const submitButton = screen.getByRole("button", {
      name: "Créer mon compte",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit le nom.
    await user.type(lastNameInput, "Siewe");

    // On saisit le prénom.
    await user.type(firstNameInput, "Alix");

    // On saisit une adresse email invalide.
    await user.type(emailInput, "adresse-invalide");

    // On saisit le numéro de téléphone.
    await user.type(phoneInput, "690000000");

    // On saisit la ville.
    await user.type(cityInput, "Douala");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On confirme le mot de passe.
    await user.type(confirmPasswordInput, "SecondLife@2026");

    // On quitte le dernier champ pour terminer la saisie.
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

    // On vérifie que la fonction d'inscription n'a pas été appelée.
    expect(registerMock).not.toHaveBeenCalled();
  });

    // Troisième test.
  it("refuse un mot de passe qui ne respecte pas les règles", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: registerMock }}>
          <RegisterForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ du nom.
    const lastNameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ du prénom.
    const firstNameInput = screen.getByLabelText(/^Prénom/i);

    // On recherche le champ de l'adresse email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ du téléphone.
    const phoneInput = screen.getByLabelText(/^Téléphone/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche le champ du mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le champ de confirmation du mot de passe.
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirmation du mot de passe/i,
    );

    // On recherche le bouton de création du compte.
    const submitButton = screen.getByRole("button", {
      name: "Créer mon compte",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit un nom valide.
    await user.type(lastNameInput, "Siewe");

    // On saisit un prénom valide.
    await user.type(firstNameInput, "Alix");

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit un numéro de téléphone.
    await user.type(phoneInput, "690000000");

    // On saisit une ville.
    await user.type(cityInput, "Douala");

    // On saisit un mot de passe trop faible.
    await user.type(passwordInput, "alix123");

    // On saisit le même mot de passe dans le champ de confirmation.
    await user.type(confirmPasswordInput, "alix123");

    // On quitte le dernier champ pour terminer la saisie.
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

    // On vérifie que le bouton reste désactivé.
    expect(submitButton).toBeDisabled();

    // On vérifie que la fonction d'inscription n'a pas été appelée.
    expect(registerMock).not.toHaveBeenCalled();
  });

    // Quatrième test.
  it("refuse deux mots de passe différents", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: registerMock }}>
          <RegisterForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ du nom.
    const lastNameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ du prénom.
    const firstNameInput = screen.getByLabelText(/^Prénom/i);

    // On recherche le champ de l'adresse email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ du téléphone.
    const phoneInput = screen.getByLabelText(/^Téléphone/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche le champ du mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le champ de confirmation du mot de passe.
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirmation du mot de passe/i,
    );

    // On recherche le bouton de création du compte.
    const submitButton = screen.getByRole("button", {
      name: "Créer mon compte",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit un nom valide.
    await user.type(lastNameInput, "Siewe");

    // On saisit un prénom valide.
    await user.type(firstNameInput, "Alix");

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit un numéro de téléphone.
    await user.type(phoneInput, "690000000");

    // On saisit une ville.
    await user.type(cityInput, "Douala");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On saisit une confirmation différente.
    await user.type(confirmPasswordInput, "SecondLife@2027");

    // On quitte le champ de confirmation.
    await user.tab();

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le message d'erreur est affiché.
    expect(
      await screen.findByText(
        "Les deux mots de passe ne correspondent pas.",
      ),
    ).toBeInTheDocument();

    // On vérifie que le bouton reste désactivé.
    expect(submitButton).toBeDisabled();

    // On vérifie que la fonction d'inscription n'a pas été appelée.
    expect(registerMock).not.toHaveBeenCalled();
  });

    // Cinquième test.
  it("inscrit un membre et le redirige vers son espace", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule les actions de l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On indique que l'inscription va réussir.
    registerMock.mockResolvedValue({
      // On prépare l'identifiant du nouveau membre.
      id: 1,

      // On prépare son nom.
      nom: "Siewe",

      // On prépare son prénom.
      prenom: "Alix",

      // On prépare son adresse email.
      email: "alix@test.com",

      // On indique son rôle.
      role: "Membre",
    });

    // On affiche le formulaire avec de fausses routes.
    render(
      <MemoryRouter initialEntries={["/inscription"]}>
        <AuthContext.Provider value={{ register: registerMock }}>
          <Routes>
            <Route
              path="/inscription"
              element={<RegisterForm />}
            />

            <Route
              path="/membre"
              element={<h1>Espace membre</h1>}
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ du nom.
    const lastNameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ du prénom.
    const firstNameInput = screen.getByLabelText(/^Prénom/i);

    // On recherche le champ de l'adresse email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ du téléphone.
    const phoneInput = screen.getByLabelText(/^Téléphone/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche le champ du mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le champ de confirmation du mot de passe.
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirmation du mot de passe/i,
    );

    // On recherche le bouton d'inscription.
    const submitButton = screen.getByRole("button", {
      name: "Créer mon compte",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit le nom.
    await user.type(lastNameInput, "Siewe");

    // On saisit le prénom.
    await user.type(firstNameInput, "Alix");

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit le numéro de téléphone.
    await user.type(phoneInput, "690000000");

    // On saisit la ville.
    await user.type(cityInput, "Douala");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On confirme le mot de passe.
    await user.type(confirmPasswordInput, "SecondLife@2026");

    // On clique sur le bouton d'inscription.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction register a été appelée une seule fois.
    expect(registerMock).toHaveBeenCalledTimes(1);

    // On vérifie que les bonnes données ont été envoyées.
    expect(registerMock).toHaveBeenCalledWith({
      nom: "Siewe",
      prenom: "Alix",
      email: "alix@test.com",
      telephone: "690000000",
      ville: "Douala",
      password: "SecondLife@2026",
      confirmPassword: "SecondLife@2026",
    });

    // On vérifie que l'espace membre est affiché après l'inscription.
    expect(
      await screen.findByRole("heading", {
        name: "Espace membre",
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

    // On crée une fausse fonction d'inscription.
    const registerMock = vi.fn();

    // On indique que l'inscription va échouer.
    registerMock.mockRejectedValue(
      // On prépare le message d'erreur envoyé par le backend.
      new Error("Cette adresse email est déjà utilisée."),
    );

    // On affiche le formulaire dans un routeur.
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: registerMock }}>
          <RegisterForm />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // On recherche le champ du nom.
    const lastNameInput = screen.getByLabelText(/^Nom/i);

    // On recherche le champ du prénom.
    const firstNameInput = screen.getByLabelText(/^Prénom/i);

    // On recherche le champ de l'adresse email.
    const emailInput = screen.getByLabelText(/^Adresse email/i);

    // On recherche le champ du téléphone.
    const phoneInput = screen.getByLabelText(/^Téléphone/i);

    // On recherche le champ de la ville.
    const cityInput = screen.getByLabelText(/^Ville/i);

    // On recherche le champ du mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le champ de confirmation du mot de passe.
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirmation du mot de passe/i,
    );

    // On recherche le bouton d'inscription.
    const submitButton = screen.getByRole("button", {
      name: "Créer mon compte",
    });

    // =========================
    // ACT : Action
    // =========================

    // On saisit le nom.
    await user.type(lastNameInput, "Siewe");

    // On saisit le prénom.
    await user.type(firstNameInput, "Alix");

    // On saisit une adresse email valide.
    await user.type(emailInput, "alix@test.com");

    // On saisit le numéro de téléphone.
    await user.type(phoneInput, "690000000");

    // On saisit la ville.
    await user.type(cityInput, "Douala");

    // On saisit un mot de passe valide.
    await user.type(passwordInput, "SecondLife@2026");

    // On confirme le mot de passe.
    await user.type(confirmPasswordInput, "SecondLife@2026");

    // On clique sur le bouton d'inscription.
    await user.click(submitButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que la fonction register a été appelée une seule fois.
    expect(registerMock).toHaveBeenCalledTimes(1);

    // On vérifie que les bonnes informations ont été envoyées.
    expect(registerMock).toHaveBeenCalledWith({
      nom: "Siewe",
      prenom: "Alix",
      email: "alix@test.com",
      telephone: "690000000",
      ville: "Douala",
      password: "SecondLife@2026",
      confirmPassword: "SecondLife@2026",
    });

    // On vérifie que le message envoyé par le backend est affiché.
    expect(
      await screen.findByText(
        "Cette adresse email est déjà utilisée.",
      ),
    ).toBeInTheDocument();
  });


});