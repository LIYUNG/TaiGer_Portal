import axios from 'axios';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DEV_URL
    : process.env.REACT_APP_PROD_URL;

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  credentials: 'same-origin',
  validateStatus: (status) => status < 500
});

export { request };
