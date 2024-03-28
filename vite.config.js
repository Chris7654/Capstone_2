import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
  },
  build: {
    chunkSizeWarningLimit: 2000, // handle warning on vendor.js bundle size
  },
  base: "/yolov5-tfjs/",
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
