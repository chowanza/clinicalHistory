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
    <div className='flex justify-around items-center bg-gradient-to-r from-primary to-secondary rounded-xl w-72 text-white font-semibold cursor-pointer relative text-center'>
      <span className='z-10 w-1/2 h-full p-2' onClick={handleSignUp}>
        Sign Up
      </span>
      <span className='z-10 w-1/2 h-full p-2' onClick={handleSignIn}>
        Sign In
      </span>
      <span
        className={`absolute w-1/2 h-full rounded-xl border-3 border-blue-950 left-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-500 ease-in-out ${
          isSignUp ? '' : 'translate-x-full'
        }`}
      ></span>
    </div>
  )
}

export default Switch
