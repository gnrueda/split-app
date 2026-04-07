import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sonda from "sonda/vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react(), Sonda()],
});
