import React from 'react'
import SignUpForm from '../components/auth/SignUpForm'
import SignInForm from '../components/auth/SignInForm'
import ChangeAuth from '../components/auth/ChangeAuth'
import ThemeSwitch from '../components/ui/ThemeSwitch'

const Auth = () => {
  return (
    <div className='relative flex flex-col justify-center items-center h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark'>
      <div className='absolute top-0 right-0 p-4'>
        <ThemeSwitch />
      </div>
      <div className='flex justify-center items-center w-[800px] mx-auto bg-red-500 m-0 p-0 overflow-hidden rounded-lg relative'>
        <SignUpForm />
        <SignInForm />
        <ChangeAuth />
      </div>
    </div>
  )
}

export default Auth
