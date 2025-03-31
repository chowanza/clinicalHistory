import React from 'react'

const SignInForm = () => {
  return (
    <div className='h-full w-full mx-auto bg-slate-800 p-6 text-white'>
      <h1 className='text-center text-2xl'>Sign In</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>Email:</label>
          <input
            className='border-slate-400 border p-2 rounded-md'
            type='email'
            id='email'
            name='email'
            required
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='password'>Password:</label>
          <input
            className='border-slate-400 border p-2 rounded-md'
            type='password'
            id='password'
            name='password'
            required
          />
        </div>
        <button type='submit' className='bg-purple-600 p-2 rounded-md'>
          Sign In
        </button>
      </form>
    </div>
  )
}

export default SignInForm
