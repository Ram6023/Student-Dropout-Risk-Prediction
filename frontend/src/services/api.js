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
  timeout: 15000,
});

/**
 * Send student data to the backend for dropout risk prediction.
 *
 * Expected request body:
 * {
 *   "attendance": 75,
 *   "sem1_cgpa": 5.0,
 *   "sem2_cgpa": 5.0,
 *   "fee_paid": 1
 * }
 *
 * @param {Object} studentData - The student academic data
 * @returns {Promise<Object>} - The prediction result
 */
export const predictDropoutRisk = async (studentData) => {
  try {
    const response = await apiClient.post('/predict', studentData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with an error status
      throw new Error(
        error.response.data?.detail ||
        `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        'Unable to reach the prediction server. Please check your connection or try again later.'
      );
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export default apiClient;
