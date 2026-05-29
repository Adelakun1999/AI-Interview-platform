import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/auth": "http://localhost:8000",
      "/resume": "http://localhost:8000",
      "/interview": "http://localhost:8000",
      "/analytics": "http://localhost:8000",
      "/user": "http://localhost:8000",
    },
  },
});
