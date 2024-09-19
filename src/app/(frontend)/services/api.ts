import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: process.env.BASE_URL,
  withCredentials: true, // To send cookies with requests
  
});


export default axiosInstance;
