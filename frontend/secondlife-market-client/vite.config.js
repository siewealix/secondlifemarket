// On importe la fonction de configuration de Vite.
import { defineConfig } from "vite";

// On importe le plugin React.
import react from "@vitejs/plugin-react";

// On importe le plugin mkcert pour créer un certificat local fiable.
import mkcert from "vite-plugin-mkcert";

// On exporte la configuration de Vite.
export default defineConfig({
  // On active les plugins nécessaires.
  plugins: [
    // On active React.
    react(),

    // On active un certificat HTTPS local fiable.
    mkcert(),
  ],

  // On configure le serveur local.
  server: {
    // On force l'utilisation de localhost.
    host: "localhost",

    // On fixe le port du frontend.
    port: 5173,

    // On active HTTPS.
    https: true,
  },
});