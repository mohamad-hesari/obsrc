import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import crypto from "crypto";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
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
