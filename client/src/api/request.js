import axios from 'axios'

// TODO: use dotenv
export const BASE_URL = process.env.BASE_URL || "https://localhost:3000";
// const BASE_URL = "https://54.187.7.192:3000";
// export const BASE_URL = "https://taigerconsultancy-portal.com";
// const BASE_URL = "https://ec2-54-214-118-145.us-west-2.compute.amazonaws.com";
// const BASE_URL = "http://ec2-54-214-118-145.us-west-2.compute.amazonaws.com";

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

