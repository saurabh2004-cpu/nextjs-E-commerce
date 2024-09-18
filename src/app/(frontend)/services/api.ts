import axios from 'axios';
import https from 'https'; // Node.js 'https' module

// Check if the code is running on the server-side (Node.js)
const isServer = typeof window === 'undefined';

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: 'https://localhost:3000',
  withCredentials: true, // To send cookies with requests
  ...(isServer && {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // Ignore SSL issues in development
    }),
  }),
});

// Export the axios instance for use throughout your app
export default axiosInstance;
