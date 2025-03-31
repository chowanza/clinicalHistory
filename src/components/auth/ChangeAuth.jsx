import React, { useState } from 'react'

const ChangeAuth = () => {
  const [authTypeState, setAuthTypeState] = useState('Sign In')
  const handleChangeAuthType = () => {
    setAuthTypeState((prev) => (prev === 'Sign In' ? 'Sign Up' : 'Sign In'))
  }
  return (
    <div
      className={`absolute w-[400px] flex flex-col justify-between items-center left-0 h-full mx-auto bg-slate-800 p-6 text-white ${
        authTypeState === 'Sign In' ? '' : 'translate-x-[400px]'
      } transition-all duration-500 ease-in-out`}
    >
      <h1 className='text-center text-2xl'>
        Aquí va texto con el nombre de la app y una imagen guapa
        {authTypeState === 'Sign In' ? '' : ' y puede cambiar'}
      </h1>
      <button
        onClick={handleChangeAuthType}
        className='bg-purple-600 p-2 rounded-md cursor-pointer'
      >
        {authTypeState === 'Sign In' ? <>Sign Up</> : <>Sign In</>}
      </button>
    </div>
  )
}

export default ChangeAuth
