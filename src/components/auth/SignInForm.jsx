import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'

const SignInForm = ({ onForgotPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { signin, errors: signinErrors, isAuthenticated } = useAuth()

  const onSubmit = handleSubmit((data) => {
    signin(data)
  })

  return (
    <div className='w-full mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5'>
      {signinErrors.map((error, i) => (
        <div
          key={i}
          className='bg-red-500 text-white p-2 rounded-xl text-center text-sm sm:text-base'
        >
          {error}
        </div>
      ))}
      <form className='flex flex-col gap-3 sm:gap-4' onSubmit={onSubmit}>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email' className='text-sm sm:text-base'>Correo:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 sm:p-3 rounded-xl dark:bg-slate-700 placeholder:text-red-500 text-sm sm:text-base'
            type='email'
            {...register('email', { required: true })}
            placeholder={errors.email && 'Email is required'}
          />
          <label htmlFor='password' className='text-sm sm:text-base'>Contraseña:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 sm:p-3 rounded-xl dark:bg-slate-700 placeholder:text-red-500 text-sm sm:text-base'
            type='password'
            {...register('password', { required: true })}
            placeholder={errors.password && 'Password is required'}
          />
        </div>
        <button
          type='button'
          onClick={onForgotPassword}
          className='font-semibold text-secondary self-end text-xs sm:text-sm hover:underline'
        >
          Olvidaste tu contraseña?
        </button>
        <button
          type='submit'
          className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 sm:p-3 rounded-xl text-white border-slate-400 border cursor-pointer
             hover:scale-105 transition-transform duration-300 
             hover:shadow-lg hover:shadow-secondary/50 
             hover:outline-2 hover:outline-white 
             hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base'
        >
          Ingresa!
        </button>
        <div className='w-full text-center'>
          <span className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm'>
            ¿No tienes una cuenta?, {' '}
          </span>
          <Link
            to='/signup'
            className='font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xs sm:text-sm'
          >
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
