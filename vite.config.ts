import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const path = process.cwd()
    const env = loadEnv(mode, path, '')

    return {
        plugins: [react()],
        server: {
            watch: {
                usePolling: true
            },
            port: 3000,
            open: true
        },
        define: {
            'process.env.API_URL': JSON.stringify(env.API_URL),
            'process.env.GEO_API': JSON.stringify(env.GEO_API),
            'process.env.API_KEY': JSON.stringify(env.API_KEY),
            'process.env.AUTH_DOMAIN': JSON.stringify(env.AUTH_DOMAIN),
            'process.env.PROJECT_ID': JSON.stringify(env.PROJECT_ID),
            'process.env.STORAGE_BUCKET': JSON.stringify(env.STORAGE_BUCKET),
            'process.env.MESSAGING_SENDER_ID': JSON.stringify(env.MESSAGING_SENDER_ID),
            'process.env.APP_ID': JSON.stringify(env.APP_ID),
            'process.env.ORIGIN_URL': JSON.stringify(env.ORIGIN_URL)
        },
        css: {
            preprocessorOptions: {
                sass: {
                    api: 'modern-compiler'
                }
            }
        }
    }
})
