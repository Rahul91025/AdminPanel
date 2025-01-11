import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Default port for local development
    host: true, // Allow access from external hosts
    strictPort: false, // Allow dynamic port binding
    watch: {
      usePolling: true, // Ensure proper behavior in Docker/CI environments like Render
    },
  },
  preview: {
    port: parseInt(process.env.PORT) || 5174, // Use Render's assigned port or default to 5174
    host: true,
  },
});
