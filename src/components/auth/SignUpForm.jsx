import { Link } from 'react-router-dom'

const SignUpForm = () => {
  return (
    <div className='h-full w-full mx-auto p-6 flex flex-col gap-5'>
      <form className='flex flex-col gap-4'>
        <div className='flex gap-2 justify-center items-center'>
          <div className='flex flex-col gap-2 w-[calc(50%_-_0.25rem)]'>
            <label htmlFor='first-name'>First Name:</label>
            <input
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700'
              type='text'
              id='first-name'
              name='first-name'
              required
            />
          </div>
          <div className='flex flex-col gap-2 w-[calc(50%_-_0.25rem)]'>
            <label htmlFor='last-name'>Last Name:</label>
            <input
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700'
              type='text'
              id='last-name'
              name='last-name'
              required
            />
          </div>
        </div>
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
          <label htmlFor='confirm-password'>Confirm Password:</label>
          <input
            className='border-slate-400 bg-slate-50 border p-2 rounded-xl dark:bg-slate-700'
            type='password'
            id='confirm-password'
            name='confirm-password'
            required
          />
        </div>
        <button
          type='submit'
          className='font-semibold bg-gradient-to-r from-primary to-secondary p-2 rounded-xl text-white'
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
