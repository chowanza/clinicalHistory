import { Link } from 'react-router-dom'

const SignInForm = () => {
  return (
    <div className='h-full w-full mx-auto p-6 flex flex-col gap-5'>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>Email:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700'
            type='email'
            id='email'
            name='email'
            required
          />
          <label htmlFor='password'>Password:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700'
            type='password'
            id='password'
            name='password'
            required
          />
        </div>
        <Link to='/signin' className='font-semibold text-secondary self-end'>
          Forgot password?
        </Link>
        <button
          type='submit'
          className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 rounded-xl text-white'
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
