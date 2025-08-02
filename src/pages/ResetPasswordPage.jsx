import React from 'react'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import ThemeToggle from '../components/ui/ThemeSwitch'
import Footer from '../components/ui/Footer'
import { motion } from 'framer-motion'

const ResetPasswordPage = () => {
  return (
    <div className='relative flex flex-col justify-center items-center min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark p-4'>
      <div className='absolute top-4 right-4 z-50'>
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col justify-center items-center w-full max-w-md mx-auto overflow-hidden rounded-lg relative bg-white dark:bg-slate-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_20px_rgb(20,10,100,0.5)] min-h-[500px]'
      >
        <div className='w-full flex justify-center items-center flex-col p-4 sm:p-6'>
          <div className='flex flex-col gap-2 w-full max-w-sm items-center mb-4'>
            <h1 className='text-center text-xl sm:text-2xl text-primary dark:text-secondary font-bold'>
              🔑 Restablecer Contraseña
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400 text-center'>
              Sistema de Historias Clínicas
            </p>
          </div>
          <div className='w-full max-w-sm'>
            <ResetPasswordForm />
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  )
}

export default ResetPasswordPage 