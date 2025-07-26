import { useNavigate } from 'react-router-dom'

const Switch = ({ isSignUp, setIsSignUp }) => {
  const navigate = useNavigate()

  const handleSignIn = () => {
    setIsSignUp(false)
    navigate('/signin')
  }

  const handleSignUp = () => {
    setIsSignUp(true)
    navigate('/signup')
  }

  return (
    <div className='flex justify-around items-center bg-gradient-to-r from-primary-opacity border-slate-400 border to-secondary-opacity rounded-xl w-full max-w-[280px] text-white font-semibold cursor-pointer relative text-center text-sm sm:text-base'>
      <span className='z-10 w-1/2 h-full p-2 flex items-center justify-center' onClick={handleSignUp}>
        Regístrate
      </span>
      <span className='z-10 w-1/2 h-full p-2 flex items-center justify-center' onClick={handleSignIn}>
        Ingresa
      </span>
      <span
        className={`absolute w-1/2 h-full rounded-xl border-3 border-white left-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-500 ease-in-out ${
          isSignUp ? '' : 'translate-x-full'
        }`}
      ></span>
    </div>
  )
}

export default Switch
