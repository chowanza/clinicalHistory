import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'
import { getAPIBaseURL } from '../../api/axios'

const ForgotPasswordForm = ({ onBackToSignIn }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setMessage('')
    setError('')
    setShowPreview(false)
    setPreviewUrl('')
    
    try {
      const response = await fetch(`${getAPIBaseURL()}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.emailSent) {
          setMessage(`${result.message}\n\n✅ Email enviado exitosamente.\n\n📧 Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.`)
          if (result.previewUrl) {
            setPreviewUrl(result.previewUrl)
            setShowPreview(true)
          }
          
          // Mostrar información adicional sobre el proceso
          setTimeout(() => {
            setMessage(prev => prev + '\n\n⏰ El enlace expirará en 10 minutos por seguridad.')
          }, 2000)
          
        } else {
          // Fallback para desarrollo
          setMessage(`${result.message}\n\n🔑 Token para desarrollo: ${result.resetToken}\n\n📝 Copia este token y ve a la página de reset de contraseña.`)
        }
      } else {
        setError(result.message || 'Error al procesar la solicitud')
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    navigate('/signin')
  }

  return (
    <div className='w-full mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5'>
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Recuperar Contraseña
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingresa tu email y te enviaremos las instrucciones para recuperar tu contraseña
        </p>
      </div>

      {message && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm'>
          {message.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm'>
          {error}
        </div>
      )}

      {showPreview && previewUrl && (
        <div className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl text-sm'>
          <p className="font-semibold mb-2">📧 Vista previa del email:</p>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Ver email enviado
          </a>
        </div>
      )}

      <form className='flex flex-col gap-3 sm:gap-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email' className='text-sm sm:text-base'>Email:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 sm:p-3 rounded-xl dark:bg-slate-700 placeholder:text-red-500 text-sm sm:text-base'
            type='email'
            {...register('email', { 
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            placeholder={errors.email?.message || 'Ingresa tu email'}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
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
          {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
        </button>

        <button
          type='button'
          onClick={handleBackToSignIn}
          className='flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors text-sm sm:text-base'
        >
          <FaArrowLeft />
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordForm 