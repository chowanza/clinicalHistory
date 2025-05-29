import axios from './axios'

export const getRecipesRequest = async (id) => axios.get(`/tasks/${id}/recipes`)
export const createRecipesRequest = async (id, data) =>
  axios.post(`/tasks/${id}/recipes`, data)
export const updateRecipesRequest = async (id, data) =>
  axios.put(`/tasks/${id}/recipes`, data)
export const deleteRecipesRequest = async (id, recipeId) =>
  axios.delete(`/tasks/${id}/recipes/${recipeId}`)
