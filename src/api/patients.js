import axios from './axios'

export const getPatientsRequest = async () => axios.get('/tasks')
export const getPatientRequest = async (id) => axios.get(`/tasks/${id}`)
export const createPatientsRequest = async (patient) => axios.post('/tasks', patient)
export const updatePatientsRequest = async (id, patient) => axios.put(`/tasks/${id}`, patient)
export const deletePatientsRequest = async (id) => axios.delete(`/tasks/${id}`)
