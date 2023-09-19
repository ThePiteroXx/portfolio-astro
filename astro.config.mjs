import glslify from "vite-plugin-glslify";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-moon-landing.netlify.app/",
  vite: {
    plugins: [glslify()],
  },
  output: "server",
});
