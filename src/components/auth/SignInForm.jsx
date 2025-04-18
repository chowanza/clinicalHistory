import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { signin, errors: signinErrors } = useAuth()

  const onSubmit = handleSubmit((data) => {
    signin(data)
  })

  return (
    <div className='h-full w-full mx-auto p-6 flex flex-col gap-5'>
      {signinErrors.map((error, i) => (
        <div
          key={i}
          className='bg-red-500 text-white p-2 rounded-xl text-center'
        >
          {error}
        </div>
      ))}
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>Email:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
            type='email'
            {...register('email', { required: true })}
            placeholder={errors.email && 'Email is required'}
          />
          <label htmlFor='password'>Password:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
            type='password'
            {...register('password', { required: true })}
            placeholder={errors.password && 'Password is required'}
          />
        </div>
        <Link to='/signin' className='font-semibold text-secondary self-end'>
          Forgot password?
        </Link>
        <button
          type='submit'
          className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 rounded-xl text-white border-slate-400 border cursor-pointer
             hover:scale-105 transition-transform duration-300 
             hover:shadow-lg hover:shadow-secondary/50 
             hover:outline-2 hover:outline-white 
             hover:bg-opacity-80 hover:animate-pulse'
        >
          Sign In
        </button>
        <div className='width-full text-center'>
          <span className='text-gray-600 dark:text-gray-400'>
            Don't have an account?{' '}
          </span>
          <Link
            to='/signup'
            className='font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
