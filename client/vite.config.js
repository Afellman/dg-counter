import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // VitePWA({
        //     registerType: "autoUpdate",
        //     workbox: {
        //         globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"], // Cache only these files
        //         runtimeCaching: [
        //             {
        //                 // Cache static assets like images/fonts if needed
        //                 urlPattern: /\.(?:png|jpg|jpeg|svg|woff2?)$/,
        //                 handler: "CacheFirst",
        //                 options: {
        //                     cacheName: "assets-cache",
        //                     expiration: {
        //                         maxEntries: 50,
        //                         maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        //                     },
        //                 },
        //             },
        //             {
        //                 // Never cache the version endpoint
        //                 urlPattern: /\/api\/system\/version/,
        //                 handler: "NetworkOnly",
        //             },
        //             // NO API route caching — simply don't include an entry that matches it
        //         ],
        //     },
        //     devOptions: {
        //         enabled: true,
        //     },
        // }),
    ],
    build: {
        outDir: "../public",
        emptyOutDir: true,
        sourcemap: true,
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
