import axios from './axios'

// Get all consultations for a patient
export const getConsultationsRequest = async (patientId) => 
  axios.get(`/tasks/${patientId}/consultations`)

// Get a specific consultation
export const getConsultationRequest = async (patientId, consultationId) => 
  axios.get(`/tasks/${patientId}/consultations/${consultationId}`)

// Create a new consultation
export const createConsultationRequest = async (patientId, consultationData) => 
  axios.post(`/tasks/${patientId}/consultations`, consultationData)

// Update a consultation
export const updateConsultationRequest = async (patientId, consultationId, consultationData) => 
  axios.put(`/tasks/${patientId}/consultations/${consultationId}`, consultationData)

// Delete a consultation
export const deleteConsultationRequest = async (patientId, consultationId) => 
  axios.delete(`/tasks/${patientId}/consultations/${consultationId}`)

// Get consultation attachments
export const getConsultationAttachmentsRequest = async (patientId, consultationId) => 
  axios.get(`/tasks/${patientId}/consultations/${consultationId}/attachments`)

// Upload attachment to consultation
export const uploadAttachmentRequest = async (patientId, consultationId, formData) => 
  axios.post(`/tasks/${patientId}/consultations/${consultationId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

// Delete attachment from consultation
export const deleteAttachmentRequest = async (patientId, consultationId, filename) => 
  axios.delete(`/tasks/${patientId}/consultations/${consultationId}/attachments/${filename}`)

// Get attachment download URL
export const getAttachmentUrl = (patientId, consultationId, filename) => 
  `${axios.defaults.baseURL}/tasks/${patientId}/consultations/${consultationId}/attachments/${filename}` 