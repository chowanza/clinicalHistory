import axios from './axios'

const signupRequest = (user) => {
  console.log('Signup URL:', '/auth/register')
  return axios.post('/auth/register', user)
}

const signinRequest = (user) => {
  console.log('Signin URL:', '/auth/login')
  return axios.post('/auth/login', user)
}

const verifyTokenRequest = () => {
  console.log('Verify URL:', '/auth/verify')
  return axios.get('/auth/verify')
}

export { signupRequest, signinRequest, verifyTokenRequest }
