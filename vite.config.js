import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    commonjs({
      include: /node_modules/, // node_modules 내부의 CommonJS 모듈 처리
    }),
  ],
  server: {
    proxy: {
      "/video": {
        target: "https://ruverse.snu.ac.kr",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/video/, "/video"),
      },
    },
  },
  resolve: {
    alias: {
      "@apis": path.resolve(__dirname, "./src/apis"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  optimizeDeps: {
    include: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  build: {
    commonjsOptions: {
      include: [/@ffmpeg\/ffmpeg/, /@ffmpeg\/util/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
