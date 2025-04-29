import { useState, useEffect } from 'react'
import ThemeSwitch from '../components/ui/ThemeSwitch'
import RightSidebar from '../components/auth/RightSidebar'
import Switch from '../components/auth/Switch'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
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
      setIsSignUp(true)
    } else if (currentPath === '/signin') {
      setIsSignUp(false)
    } else {
      navigate('/signin')
    }
  }, [currentPath])

  return (
    <div className='relative flex flex-col justify-center items-center h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark'>
      <div className='absolute top-0 right-0 p-4'>
        <ThemeSwitch />
      </div>
      <motion.div
        layout
        transition={{ duration: 0.3, ease: 'circIn' }}
        className='flex justify-center items-center w-[800px] mx-auto m-0 p-0 overflow-hidden rounded-lg relative bg-white max-h-max dark:bg-slate-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_20px_rgb(20,10,100,0.5)]'
      >
        <div className='w-[55%] flex justify-center items-center flex-col pt-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-center text-2xl text-primary dark:text-secondary font-bold'>
              {isSignUp ? 'Crea una cuenta' : 'Bienvenido Doc! Ingresa'}
            </h1>
            <Switch isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          </div>
          <Outlet />
        </div>
        <RightSidebar />
      </motion.div>
    </div>
  )
}

export default Auth
