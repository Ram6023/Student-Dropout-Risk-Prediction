import axios from 'axios';

// Use relative path in production (Vercel) and absolute in local dev
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api' 
  : 'http://localhost:8000';

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
    throw new Error(error.response.data?.detail || `Server error: ${error.response.status}`);
  } else if (error.request) {
    throw new Error('Unable to reach the server. Please check your connection.');
  } else {
    throw new Error(`Request failed: ${error.message}`);
  }
};

export default apiClient;
