import axios from 'axios';

// Detect environment automatically
const getBaseURL = () => {
  // If we are on Vercel (or any production domain), use the relative /api path
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api';
    }
  }
  
  // Local development defaults to the uvicorn port
  return 'http://localhost:8000';
};

const API_BASE_URL = getBaseURL();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Single prediction
 */
export const predictDropoutRisk = async (studentData) => {
  try {
    const response = await apiClient.post('/predict', studentData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Bulk prediction via CSV
 */
export const predictDropoutCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/predict-csv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    // Attempt to extract detail from FastAPI error response
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
