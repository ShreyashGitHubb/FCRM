// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://fcrm-02g1.onrender.com", // ✅ your Render backend
//   withCredentials: true, // ✅ needed for cookies/sessions
// });

// export default instance;
// src/utils/axios.js
import axios from "axios"

const API = axios.create({
  baseURL: "https://fcrm-02g1.onrender.com",
})

// Add token automatically before each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
