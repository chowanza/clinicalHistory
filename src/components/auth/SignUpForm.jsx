import React from 'react'

const SignUpForm = () => {
  return (
    <div className='h-full w-full mx-auto bg-slate-800 p-6 text-white'>
      <h1 className='text-center text-2xl'>Sign Up</h1>
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
          <label htmlFor='first-name'>First Name:</label>
          <input
            className='border-slate-400 border p-2 rounded-md'
            type='text'
            id='first-name'
            name='first-name'
            required
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='last-name'>Last Name:</label>
          <input
            className='border-slate-400 border p-2 rounded-md'
            type='text'
            id='last-name'
            name='last-name'
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
        <div className='flex flex-col gap-2'>
          <label htmlFor='confirm-password'>Confirm Password:</label>
          <input
            className='border-slate-400 border p-2 rounded-md'
            type='password'
            id='confirm-password'
            name='confirm-password'
            required
          />
        </div>
        <button type='submit' className='bg-purple-600 p-2 rounded-md'>
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignUpForm
