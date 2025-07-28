import axios from './axios'

const API_URL = 'http://localhost:4000/api'

const signupRequest = (user) => {
  console.log('Signup URL:', API_URL + '/auth/register')
  return axios.post('/auth/register', user)
}

const signinRequest = (user) => {
  console.log('Signin URL:', API_URL + '/auth/login')
  return axios.post('/auth/login', user)
}

const verifyTokenRequest = () => {
  console.log('Verify URL:', API_URL + '/auth/verify')
  return axios.get('/auth/verify')
}

export { signupRequest, signinRequest, verifyTokenRequest }
