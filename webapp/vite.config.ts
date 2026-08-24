import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 11164,
    host: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:11163",
        changeOrigin: true,
      },
      "/mcp": {
        target: "http://127.0.0.1:11163",
        changeOrigin: true,
      },
    },
  },
});
