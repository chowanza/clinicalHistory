import axios from './axios'

export const getPatientsRequest = async () => axios.get('/tasks')
export const getPatientRequest = async (id) => axios.get(`/tasks/${id}`)
export const createPatientsRequest = async (patient) => axios.post('/tasks', patient)
export const updatePatientsRequest = async (patient) => axios.put(`/tasks/${patient._id}`, patient)
export const deletePatientsRequest = async (id) => axios.delete(`/tasks/${id}`)
