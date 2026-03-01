import axios from 'axios'

// Configuración para usar la variable de entorno de Vite
// Esto permite que el build para la clínica (local) apunte a :4000
// y el build para Vercel apunte a la nube en Render
const getBaseURL = () => {
  return import.meta.env.VITE_API_URL || 'https://clinicalhistorybackend.onrender.com/api'
}

// Helper function para obtener la URL base (para usar con fetch)
export const getAPIBaseURL = () => {
  return getBaseURL()
}

const instance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000, // 30 segundos de timeout
})

// Interceptor para manejar errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend server might be down')
    }

    return Promise.reject(error)
  }
)

export default instance

