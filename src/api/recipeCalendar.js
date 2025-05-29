import axios from './axios'

export const getRecipesRequest = async (id) => axios.get(`/tasks/${id}/recipes`)
export const createRecipesRequest = async (id, patient) =>
  axios.post(`/tasks/${id}/recipes`, patient)
export const updateRecipesRequest = async (id, patient) =>
  axios.put(`/tasks/${id}/recipes`, patient)
export const deleteRecipesRequest = async (id, recipeId) =>
  axios.delete(`/tasks/${id}/recipes/${recipeId}`)
