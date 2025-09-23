import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import * as fs from 'node:fs'

export default defineConfig({
    plugins: [vue({})],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },

    server: {
        port: 8081,
        https: {
            key: fs.readFileSync('./localhost+2-key.pem'),
            cert: fs.readFileSync('./localhost+2.pem'),
        },
    },

    optimizeDeps: {
        include: [
            'pdfjs-dist',
            'firebase/app',
            'firebase/database',
            'firebase/auth',
            'firebase/storage',
        ],
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/assets/styles/mixins.scss" as *;`,
            },
        },
    },

    define: {
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
    },
})
