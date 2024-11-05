import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Proporciona las variables de entorno a tu aplicación
      __API_URL__: JSON.stringify(env.VITE_API_URL)
    }
  }
})