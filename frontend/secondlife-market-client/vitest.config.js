// On importe la fonction permettant de configurer Vitest.
import { defineConfig } from "vitest/config";

// On importe le plugin React.
import react from "@vitejs/plugin-react";

// On exporte la configuration de Vitest.
export default defineConfig({
  // On active la prise en charge de React et JSX.
  plugins: [react()],

  // On configure les tests.
  test: {
    // On permet d'utiliser describe, it, expect et vi sans les importer.
    globals: true,

    // On simule un navigateur dans le terminal.
    environment: "jsdom",

    // On charge ce fichier avant chaque fichier de test.
    setupFiles: "./src/setupTests.js",

    // On reconnaît les fichiers de tests placés dans src/Test.
    include: ["src/Test/**/*.{test,spec}.{js,jsx}"],

    // On autorise le chargement des fichiers CSS dans les composants.
    css: true,

    // On configure le rapport de couverture.
    coverage: {
      // On utilise le moteur V8.
      provider: "v8",

      // On affiche la couverture dans le terminal.
      reporter: ["text", "html"],

      // On place le rapport dans le dossier coverage.
      reportsDirectory: "./coverage",

      // On ignore les fichiers de tests.
      exclude: [
        "src/Test/**",
        "src/setupTests.js",
        "src/main.jsx",
      ],
    },
  },
});