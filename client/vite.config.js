import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
            manifest: {
                name: "DG Tracker",
                short_name: "DG Tracker",
                description: "Disc Golf Score Tracking App",
                theme_color: "#ffffff",
                icons: [
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
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
    build: {
        outDir: "../public",
        emptyOutDir: true,
    },
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: "http://localhost:8081/api",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
