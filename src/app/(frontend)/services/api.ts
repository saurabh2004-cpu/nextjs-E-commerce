import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:3000',
  withCredentials: true, // To send cookies with requests
});


export default axiosInstance;
