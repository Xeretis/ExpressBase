import { defineConfig, loadEnv } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
        plugins: [react()],
        esbuild: {
            logOverride: { "this-is-undefined-in-esm": "silent" },
        },
        server: {
            proxy: {
                "/api": {
                    target: process.env.VITE_BACKEND_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
