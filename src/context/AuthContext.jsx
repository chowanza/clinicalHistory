import { createContext, useState, useContext, useEffect } from 'react'
import { signupRequest, signinRequest, verifyTokenRequest } from '../api/auth'
import { usePatients } from './PatientsCotext'
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
  const { setPatients } = usePatients()

  const signup = async (user) => {
    try {
      const res = await signupRequest(user)
      console.log(res.data)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.log(error.response)
      setErrors(error.response.data)
    }
  }

  const signin = async (user) => {
    try {
      const res = await signinRequest(user)
      console.log(res)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data)
      } else if (error.response.data.message) {
        setErrors([error.response.data.message])
      } else {
        setErrors(['An unknown error occurred'])
      }
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    setPatients([])
    setIsAuthenticated(false)
  }

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([])
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [errors])

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get()
      console.log(cookies)
      if (!cookies.token) {
        setIsAuthenticated(false)
        setLoading(false)
        return setUser(null)
      }

      try {
        const res = await verifyTokenRequest(cookies.token)
        console.log(res)
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
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
