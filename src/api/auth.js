import axios from './axios'

const API_URL = 'http://localhost:4000/api'

const signupRequest = (user) => {
  console.log('Signup URL:', API_URL + '/register')
  return axios.post('/register', user)
}

const signinRequest = (user) => {
  console.log('Signin URL:', API_URL + '/login')
  return axios.post('/login', user)
}

const verifyTokenRequest = () => {
  console.log('Verify URL:', API_URL + '/verify')
  return axios.get('/verify')
}

export { signupRequest, signinRequest, verifyTokenRequest }
