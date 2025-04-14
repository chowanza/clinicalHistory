import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { signup, isAuthenticated, errors: SignupErrors } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard-doctor')
    }
  }, [isAuthenticated])

  const onSubmit = handleSubmit(async (values) => {
    signup(values)
  })

  return (
    <div className='h-full w-full mx-auto p-6 flex flex-col gap-5'>
      {SignupErrors.map((error, i) => (
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
            <label htmlFor='first-name'>First Name:</label>
            <input
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
              type='text'
              {...register('firstname', { required: true })}
              placeholder={errors.firstname && 'First name is required'}
            />
          </div>
          <div className='flex flex-col gap-2 w-[calc(50%_-_0.25rem)]'>
            <label htmlFor='last-name'>Last Name:</label>
            <input
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700 placeholder:text-red-500'
              type='text'
              {...register('lastname', { required: true })}
              placeholder={errors.lastname && 'Last name is required'}
            />
          </div>
        </div>
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
          <label htmlFor='confirm-password'>Confirm Password:</label>
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
          Sign Up
        </button>

        <div className='width-full text-center'>
          <span className='text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
          </span>
          <Link
            to='/signin'
            className='font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
