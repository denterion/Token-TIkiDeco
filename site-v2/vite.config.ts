import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "site-v2",
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: "../site",
    emptyOutDir: false,
    sourcemap: false,
    assetsDir: "assets/v2",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "framer-motion"]
        }
      }
    }
  }
});
