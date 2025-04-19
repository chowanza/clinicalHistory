import axios from './axios'

const API = 'http://localhost:4000/api'

export const signupRequest = (user) => axios.post('/register', user)

export const signinRequest = (user) => axios.post('/login', user)

export const verifyTokenRequest = () => axios.get('/verify')
