import React from 'react'
import SignUpForm from '../components/auth/SignUpForm'
import SignInForm from '../components/auth/SignInForm'
import ChangeAuth from '../components/auth/ChangeAuth'

const Auth = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-slate-900 text-white'>
      <div className='flex justify-center items-center w-[800px] mx-auto bg-red-500 m-0 p-0 overflow-hidden rounded-lg relative'>
        <SignUpForm />
        <SignInForm />
        <ChangeAuth />
      </div>
    </div>
  )
}

export default Auth
