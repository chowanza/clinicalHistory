import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { signup, errors: signupErrors } = useAuth()

  const onSubmit = handleSubmit(async (values) => {
    signup(values)
  })

  return (
    <div className='h-full w-full mx-auto p-6 flex flex-col gap-5'>
      {signupErrors.map((error, i) => (
        <div
          key={i}
          className='bg-red-500 text-white p-2 rounded-xl text-center'
        >
          {error}
        </div>
      ))}
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <div className='flex gap-2 justify-center items-center'>
          <div className='flex flex-col gap-2 w-[calc(50%_-_0.25rem)]'>
            <label htmlFor='first-name'>Nombre:</label>
            <input
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
              type='text'
              {...register('firstName', { required: true })}
              placeholder={errors.firstName && 'First name is required'}
            />
          </div>
          <div className='flex flex-col gap-2 w-[calc(50%_-_0.25rem)]'>
            <label htmlFor='last-name'>Apellido:</label>
            <input
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
              type='text'
              {...register('lastName', { required: true })}
              placeholder={errors.lastName && 'Last name is required'}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>Correo:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
            type='email'
            {...register('email', { required: true })}
            placeholder={errors.email && 'Email is required'}
          />
          <label htmlFor='password'>Contraseña:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
            type='password'
            {...register('password', { required: true })}
            placeholder={errors.password && 'Password is required'}
          />
          <label htmlFor='confirm-password'>Confirmar Contraseña:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
            type='password'
            {...register('confirmPassword', { required: true })}
            placeholder={
              errors.confirmPassword && 'Confirm password is required'
            }
          />
        </div>
        <button
          type='submit'
          className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 rounded-xl text-white border-slate-400 border cursor-pointer
             hover:scale-105 transition-transform duration-300 
             hover:shadow-lg hover:shadow-secondary/50 
             hover:outline-2 hover:outline-white 
             hover:bg-opacity-80 hover:animate-pulse'
        >
          Regístrate!
        </button>

        <div className='width-full text-center'>
          <span className='text-gray-600 dark:text-gray-400'>
            ¿Ya tienes una cuenta?{' '}
          </span>
          <Link
            to='/signin'
            className='font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
          >
            Ingresa
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
