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
            'process.env.API_URL': JSON.stringify(env.API_URL), // Replace with your API URL
            'process.env.GEO_API': JSON.stringify(env.GEO_API) // Replace with your Geocoding API URL
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
