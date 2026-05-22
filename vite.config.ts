import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        formulario: resolve(__dirname, "formulario.html"),
        enviado: resolve(__dirname, "enviado.html"),
        contato: resolve(__dirname, "contato.html"),
        sobre: resolve(__dirname, "sobre.html"),
        politicaPrivacidade: resolve(__dirname, "politica-privacidade.html"),
        politicaReembolso: resolve(__dirname, "politica-reembolso.html"),
        termosDeUso: resolve(__dirname, "termos-de-uso.html"),
      },
    },
  },
});
