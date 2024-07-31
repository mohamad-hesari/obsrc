import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import crypto from "crypto";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const baseUrl = env.VITE_BASE_URL || "/";
  console.log("this is the base url: ", baseUrl);
  return {
    base: baseUrl,
    plugins: [
      react(),
      VitePWA({
        registerType: "prompt",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon-180x180.png",
          "maskable-icon-512x512.png",
        ],
        manifest: {
          name: "OBSRC",
          short_name: "OBS Remote Controller",
          description: "This is a remote controller for OBS",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/apple-touch-icon-180x180.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "apple touch icon",
            },
          ],
          theme_color: "#171717",
          background_color: "#f0e7db",
          display: "standalone",
          scope: baseUrl,
          start_url: baseUrl,
          orientation: "portrait",
        },
      }),
    ],
    build: {
      outDir: "dist",
      reportCompressedSize: true,
      cssMinify: "lightningcss",
    },
    css: {
      modules: {
        generateScopedName:
          command === "serve"
            ? undefined
            : function (name, fileName, css) {
                // const componentName = fileName
                //   .replace(/\.\w+$/, '')
                //   .split('/')
                //   .pop();

                // Generate hash
                const hash = crypto
                  .createHash("md5")
                  .update(css)
                  .update(fileName)
                  .update(name)
                  .digest("hex")
                  .substring(0, 6);
                return `_${hash}`;
                // return `${componentName}__${name}__${hash}`;
              },
      },
    },
  };
});
