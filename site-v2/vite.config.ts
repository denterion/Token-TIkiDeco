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
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          react: ["react", "react-dom", "framer-motion"]
        }
      }
    }
  }
});
