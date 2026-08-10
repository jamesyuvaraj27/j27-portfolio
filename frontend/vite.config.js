import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  cacheDir: "node_modules/.vite_cache2",
  server: {
    port: 5173,
  },
});
