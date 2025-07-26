import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const token = searchParams.get('token')
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    setMessage('')
    setError('')
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token || data.token,
          newPassword: data.password
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(result.message)
        setTimeout(() => {
          navigate('/signin')
        }, 2000)
      } else {
        setError(result.message || 'Error al restablecer la contraseña')
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className='w-full mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5'>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
            Token Inválido
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            El enlace de recuperación de contraseña es inválido o ha expirado.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 sm:p-3 rounded-xl text-white border-slate-400 border cursor-pointer
               hover:scale-105 transition-transform duration-300 
               hover:shadow-lg hover:shadow-secondary/50 
               hover:outline-2 hover:outline-white 
               hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base'
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5'>
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Restablecer Contraseña
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingresa tu nueva contraseña
        </p>
      </div>

      {message && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm'>
          {message}
        </div>
      )}

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm'>
          {error}
        </div>
      )}

      <form className='flex flex-col gap-3 sm:gap-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <label htmlFor='password' className='text-sm sm:text-base'>Nueva Contraseña:</label>
          <div className="relative">
            <input
              className='border-slate-400 bg-slate-50 border p-2 sm:p-3 rounded-xl dark:bg-slate-700 placeholder:text-red-500 text-sm sm:text-base w-full pr-10'
              type={showPassword ? 'text' : 'password'}
              {...register('password', { 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              placeholder={errors.password?.message || 'Ingresa tu nueva contraseña'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='confirmPassword' className='text-sm sm:text-base'>Confirmar Contraseña:</label>
          <div className="relative">
            <input
              className='border-slate-400 bg-slate-50 border p-2 sm:p-3 rounded-xl dark:bg-slate-700 placeholder:text-red-500 text-sm sm:text-base w-full pr-10'
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', { 
                required: 'Confirma tu contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden'
              })}
              placeholder={errors.confirmPassword?.message || 'Confirma tu nueva contraseña'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 sm:p-3 rounded-xl text-white border-slate-400 border cursor-pointer
             hover:scale-105 transition-transform duration-300 
             hover:shadow-lg hover:shadow-secondary/50 
             hover:outline-2 hover:outline-white 
             hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base
             disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordForm 