import axios from 'axios'

const API = 'http://localhost:4000/api'

export const signupRequest = (user) => axios.post(`${API}/register`, user)
