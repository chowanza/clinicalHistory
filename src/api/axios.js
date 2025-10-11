import axios from 'axios'

// ConfiguraciÃ³n para diferentes entornos
const getBaseURL = () => {
  // Forzar uso del backend de producciÃ³n incluso en desarrollo
  // Cambiar a false para usar localhost en desarrollo
  const useProductionBackend = false
  
  if (import.meta.env.DEV && !useProductionBackend) {
    return 'http://localhost:4000/api'
  }
  
  // En producciÃ³n, usar la URL del backend desplegado en Render
  return 'https://clinicalhistorybackend.onrender.com/api'
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

