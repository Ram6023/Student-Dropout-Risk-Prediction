import axios from 'axios';

/**
 * Unified API Client
 * ------------------
 * Using a relative path '/api' for both development and production.
 * - In Development: Vite proxies '/api' to 'http://localhost:8000' (see vite.config.js)
 * - In Production: Vercel routes '/api' to the serverless functions (see vercel.json)
 */
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const predictDropoutRisk = async (studentData) => {
  try {
    const response = await apiClient.post('/predict', studentData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const predictDropoutCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await apiClient.post('/predict-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    const detail = error.response.data?.detail;
    const msg = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(msg || `Server error: ${error.response.status}`);
  } else if (error.request) {
    throw new Error('Unable to reach the server. Please check your connection.');
  } else {
    throw new Error(`Request failed: ${error.message}`);
  }
};

export default apiClient;
