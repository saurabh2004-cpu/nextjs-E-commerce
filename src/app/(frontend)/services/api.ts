import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://localhost:3000',
  baseURL: 'https://nextjs-e-commerce-2.vercel.app',
  withCredentials: true, // To send cookies with requests
  
});


export default axiosInstance;
