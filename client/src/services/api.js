import axios from "axios";

console.log("ENV URL:", import.meta.env.VITE_API_URL);

const baseURL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${baseURL}/api`,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
