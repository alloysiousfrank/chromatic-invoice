import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages, which serves the app from
  // https://<user>.github.io/chromatic-invoice/ rather than the domain root.
  base: "/chromatic-invoice/",
});
