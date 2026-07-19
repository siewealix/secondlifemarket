// On importe render pour afficher le composant.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe userEvent pour simuler les clics de l'utilisateur.
import userEvent from "@testing-library/user-event";

// On importe le composant que nous allons tester.
import AuthPasswordField from "../components/ui/AuthPasswordField.jsx";

// On regroupe les tests du composant AuthPasswordField.
describe("AuthPasswordField", () => {
  // Premier test.
  it("affiche le champ mot de passe", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une fausse fonction pour gérer la saisie.
    const onChangeMock = vi.fn();

    // =========================
    // ACT : Action
    // =========================

    // On affiche le composant.
    render(
      <AuthPasswordField
        id="password"
        name="password"
        label="Mot de passe"
        value=""
        onChange={onChangeMock}
        placeholder="Entrez votre mot de passe"
        autoComplete="current-password"
        required={true}
      />,
    );

    // On recherche le champ grâce à son label.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ est présent.
    expect(passwordInput).toBeInTheDocument();

    // On vérifie que le champ possède le bon nom.
    expect(passwordInput).toHaveAttribute("name", "password");

    // On vérifie que le champ est obligatoire.
    expect(passwordInput).toBeRequired();

    // On vérifie que le texte d'aide est correct.
    expect(passwordInput).toHaveAttribute(
      "placeholder",
      "Entrez votre mot de passe",
    );
  });

  // Deuxième test.
  it("masque le mot de passe par défaut", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On crée une fausse fonction pour gérer la saisie.
    const onChangeMock = vi.fn();

    // =========================
    // ACT : Action
    // =========================

    // On affiche le composant avec un mot de passe.
    render(
      <AuthPasswordField
        id="password"
        name="password"
        label="Mot de passe"
        value="Test@123456"
        onChange={onChangeMock}
        placeholder="Entrez votre mot de passe"
        autoComplete="current-password"
        required={true}
      />,
    );

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton Afficher.
    const showButton = screen.getByRole("button", {
      name: "Afficher le mot de passe",
    });

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le mot de passe est masqué.
    expect(passwordInput).toHaveAttribute("type", "password");

    // On vérifie que la valeur existe dans le champ.
    expect(passwordInput).toHaveValue("Test@123456");

    // On vérifie que le bouton Afficher est présent.
    expect(showButton).toBeInTheDocument();

    // On vérifie le texte du bouton.
    expect(showButton).toHaveTextContent("Afficher");
  });

  // Troisième test.
  it("affiche le mot de passe après un clic sur Afficher", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction pour gérer la saisie.
    const onChangeMock = vi.fn();

    // On affiche le composant.
    render(
      <AuthPasswordField
        id="password"
        name="password"
        label="Mot de passe"
        value="Test@123456"
        onChange={onChangeMock}
        placeholder="Entrez votre mot de passe"
        autoComplete="current-password"
        required={true}
      />,
    );

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton Afficher.
    const showButton = screen.getByRole("button", {
      name: "Afficher le mot de passe",
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique sur le bouton Afficher.
    await user.click(showButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ devient un champ texte.
    expect(passwordInput).toHaveAttribute("type", "text");

    // On recherche maintenant le bouton Masquer.
    const hideButton = screen.getByRole("button", {
      name: "Masquer le mot de passe",
    });

    // On vérifie que le bouton affiche le texte Masquer.
    expect(hideButton).toHaveTextContent("Masquer");
  });

  // Quatrième test.
  it("masque de nouveau le mot de passe après un second clic", async () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare l'outil qui simule l'utilisateur.
    const user = userEvent.setup();

    // On crée une fausse fonction pour gérer la saisie.
    const onChangeMock = vi.fn();

    // On affiche le composant.
    render(
      <AuthPasswordField
        id="password"
        name="password"
        label="Mot de passe"
        value="Test@123456"
        onChange={onChangeMock}
        placeholder="Entrez votre mot de passe"
        autoComplete="current-password"
        required={true}
      />,
    );

    // On recherche le champ mot de passe.
    const passwordInput = screen.getByLabelText(/^Mot de passe/i);

    // On recherche le bouton Afficher.
    const showButton = screen.getByRole("button", {
      name: "Afficher le mot de passe",
    });

    // =========================
    // ACT : Action
    // =========================

    // On clique une première fois pour afficher le mot de passe.
    await user.click(showButton);

    // On recherche le nouveau bouton Masquer.
    const hideButton = screen.getByRole("button", {
      name: "Masquer le mot de passe",
    });

    // On clique une deuxième fois pour masquer le mot de passe.
    await user.click(hideButton);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que le champ est de nouveau masqué.
    expect(passwordInput).toHaveAttribute("type", "password");

    // On vérifie que le bouton Afficher est de nouveau présent.
    expect(
      screen.getByRole("button", {
        name: "Afficher le mot de passe",
      }),
    ).toBeInTheDocument();
  });
});