import axios from 'axios'

const API = 'https://api.example.com/api'

export const signupRequest = (user) => axios.post(`${API}/signup`, user)
