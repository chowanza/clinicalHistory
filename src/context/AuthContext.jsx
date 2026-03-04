import { createContext, useState, useContext, useEffect } from 'react'
import { signupRequest, signinRequest, verifyTokenRequest } from '../api/auth'
import { usePatients } from './PatientsContext'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const { setPatients } = usePatients()

  const signup = async (user) => {
    setIsAuthLoading(true)
    try {
      setErrors([]) // Limpiar errores anteriores
      const res = await signupRequest(user)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error en signup:', error)
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data)
        } else if (error.response.data.message) {
          setErrors([error.response.data.message])
        } else {
          setErrors(['Error en el registro'])
        }
      } else {
        setErrors(['Error de conexión'])
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  const signin = async (user) => {
    setIsAuthLoading(true)
    try {
      setErrors([]) // Limpiar errores anteriores
      const res = await signinRequest(user)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error en signin:', error)
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data)
        } else if (error.response.data.message) {
          setErrors([error.response.data.message])
        } else {
          setErrors(['Error en el inicio de sesión'])
        }
      } else {
        setErrors(['Error de conexión'])
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    setPatients([])
    setIsAuthenticated(false)
    setErrors([])
  }

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([])
      }, 5000) // Aumentado a 5 segundos
      return () => clearTimeout(timer)
    }
  }, [errors])

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await verifyTokenRequest()
        if (!res.data) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }
        setIsAuthenticated(true)
        setUser(res.data)
        setLoading(false)
      } catch (error) {
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
      }
    }
    checkLogin()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        loading,
        isAuthLoading,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
