import axios from 'axios'

// Configuración para diferentes entornos
const getBaseURL = () => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:4000/api'
  }
  
  // En producción, usar la URL del backend desplegado en Render
  return 'https://clinicalhistorybackend.onrender.com/api'
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
