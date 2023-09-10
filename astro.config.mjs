import image from "@astrojs/image";
import tailwind from "@astrojs/tailwind";
import glslify from "vite-plugin-glslify";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-moon-landing.netlify.app/",
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
  ],
  vite: {
    plugins: [glslify()],
    ssr: {
      external: ["svgo"],
    },
  },
});
