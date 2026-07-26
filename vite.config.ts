import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    // Ảnh nhỏ inline thành data URI để bớt request; ảnh lớn vẫn tách file riêng.
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /**
         * Tách vendor thành chunk riêng để chúng được cache lâu dài giữa các
         * lần deploy. Trước đây leaflet (~150KB) nằm chung chunk của trang
         * tra cứu đơn nên khách phải tải lại mỗi lần code trang đó thay đổi.
         */
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          leaflet: ["leaflet", "react-leaflet"],
          motion: ["motion"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
