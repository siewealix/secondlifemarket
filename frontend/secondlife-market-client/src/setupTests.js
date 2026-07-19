// On importe les vérifications supplémentaires de Testing Library.
import "@testing-library/jest-dom";

// On importe afterEach depuis Vitest.
import { afterEach } from "vitest";

// On importe la fonction de nettoyage de Testing Library.
import { cleanup } from "@testing-library/react";

// Après chaque test, on supprime les composants affichés.
afterEach(() => {
  // On nettoie le faux navigateur.
  cleanup();
});