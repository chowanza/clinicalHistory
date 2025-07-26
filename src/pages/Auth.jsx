import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ui/ThemeSwitch'
import RightSidebar from '../components/auth/RightSidebar'
import Switch from '../components/auth/Switch'
import SignInForm from '../components/auth/SignInForm'
import SignUpForm from '../components/auth/SignUpForm'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/ui/Footer'

const Auth = () => {
  const [authMode, setAuthMode] = useState('signin') // signin, signup, forgot-password, reset-password
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard-doctor')
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (currentPath === '/signup') {
      setAuthMode('signup')
    } else if (currentPath === '/signin') {
      setAuthMode('signin')
    } else if (currentPath === '/forgot-password') {
      setAuthMode('forgot-password')
    } else if (currentPath === '/reset-password') {
      setAuthMode('reset-password')
    } else {
      navigate('/signin')
    }
  }, [currentPath])

  const handleForgotPassword = () => {
    setAuthMode('forgot-password')
    navigate('/forgot-password')
  }

  const handleBackToSignIn = () => {
    setAuthMode('signin')
    navigate('/signin')
  }

  const renderForm = () => {
    switch (authMode) {
      case 'signin':
        return <SignInForm onForgotPassword={handleForgotPassword} />
      case 'signup':
        return <SignUpForm />
      case 'forgot-password':
        return <ForgotPasswordForm onBackToSignIn={handleBackToSignIn} />
      case 'reset-password':
        return <ResetPasswordForm />
      default:
        return <SignInForm onForgotPassword={handleForgotPassword} />
    }
  }

  const getTitle = () => {
    switch (authMode) {
      case 'signin':
        return 'Bienvenido Doc! Ingresa'
      case 'signup':
        return 'Crea una cuenta'
      case 'forgot-password':
        return 'Recuperar Contraseña'
      case 'reset-password':
        return 'Restablecer Contraseña'
      default:
        return 'Bienvenido Doc! Ingresa'
    }
  }

  const showSwitch = authMode === 'signin' || authMode === 'signup'

  return (
    <div className='relative flex flex-col justify-center items-center min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark p-4'>
      <div className='absolute top-4 right-4 z-50'>
        <ThemeToggle />
      </div>
      <motion.div
        layout
        transition={{ duration: 0.3, ease: 'circIn' }}
        className='flex flex-col md:flex-row justify-center items-center w-full max-w-4xl mx-auto overflow-hidden rounded-lg relative bg-white dark:bg-slate-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_20px_rgb(20,10,100,0.5)] min-h-[600px]'
      >
        <div className='w-full md:w-[55%] flex justify-center items-center flex-col p-4 sm:p-6 md:pt-4'>
          <div className='flex flex-col gap-2 w-full max-w-sm items-center'>
            <h1 className='text-center text-xl sm:text-2xl text-primary dark:text-secondary font-bold'>
              {getTitle()}
            </h1>
            {showSwitch && <Switch isSignUp={authMode === 'signup'} setIsSignUp={(isSignUp) => setAuthMode(isSignUp ? 'signup' : 'signin')} />}
          </div>
          <div className='w-full max-w-sm'>
            {renderForm()}
          </div>
        </div>
        <div className='w-full md:w-[45%]'>
          <RightSidebar />
        </div>
      </motion.div>
      <Footer />
    </div>
  )
}

export default Auth
