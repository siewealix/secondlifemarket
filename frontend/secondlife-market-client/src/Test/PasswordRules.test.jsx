// On importe render pour afficher le composant.
import { render } from "@testing-library/react";

// On importe screen pour rechercher les éléments affichés.
import { screen } from "@testing-library/react";

// On importe le composant que nous allons tester.
import PasswordRules from "../components/ui/PasswordRules.jsx";

// On regroupe les tests du composant PasswordRules.
describe("PasswordRules", () => {
  // Premier test.
  it("affiche les règles du mot de passe", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare deux règles du mot de passe.
    const rules = [
      // Cette règle n'est pas respectée.
      {
        label: "Au moins 12 caractères",
        valid: false,
      },

      // Cette règle est respectée.
      {
        label: "Au moins une lettre majuscule",
        valid: true,
      },
    ];

    // =========================
    // ACT : Action
    // =========================

    // On affiche le composant avec les règles préparées.
    render(<PasswordRules rules={rules} />);

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On recherche la liste des règles.
    const rulesList = screen.getByRole("list", {
      name: "Règles du mot de passe",
    });

    // On vérifie que la liste est affichée.
    expect(rulesList).toBeInTheDocument();

    // On vérifie que la première règle est affichée.
    expect(
      screen.getByText("Au moins 12 caractères"),
    ).toBeInTheDocument();

    // On vérifie que la deuxième règle est affichée.
    expect(
      screen.getByText("Au moins une lettre majuscule"),
    ).toBeInTheDocument();
  });

  // Deuxième test.
  it("distingue une règle valide d'une règle invalide", () => {
    // =========================
    // ARRANGE : Préparation
    // =========================

    // On prépare une règle invalide et une règle valide.
    const rules = [
      // Cette règle doit recevoir la classe invalid.
      {
        label: "Au moins 12 caractères",
        valid: false,
      },

      // Cette règle doit recevoir la classe valid.
      {
        label: "Au moins un chiffre",
        valid: true,
      },
    ];

    // =========================
    // ACT : Action
    // =========================

    // On affiche le composant.
    render(<PasswordRules rules={rules} />);

    // On récupère les deux éléments de la liste.
    const ruleItems = screen.getAllByRole("listitem");

    // =========================
    // ASSERT : Vérifications
    // =========================

    // On vérifie que deux règles sont affichées.
    expect(ruleItems).toHaveLength(2);

    // On vérifie que la première règle possède la classe invalid.
    expect(ruleItems[0]).toHaveClass("invalid");

    // On vérifie que la deuxième règle possède la classe valid.
    expect(ruleItems[1]).toHaveClass("valid");
  });
});