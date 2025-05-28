import axios from './axios'

export const getVaccination = async (id) =>
  axios.get(`/tasks/${id}/vaccination`)
export const updateVaccination = async (id, patient) =>
  axios.put(`/tasks/${id}/vaccination`, patient)
