import axios from 'axios'

// TODO: use dotenv
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
// const BASE_URL = "http://54.214.118.145:3000";

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

