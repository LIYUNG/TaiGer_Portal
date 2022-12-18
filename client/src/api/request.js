import axios from 'axios'

// TODO: use dotenv
// export const BASE_URL = process.env.BASE_URL || "https://localhost:3000";
export const BASE_URL = "https://taigerconsultancy-portal.com";

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  credentials: "same-origin",
  validateStatus: (status) => status < 500,
});

export default request;

