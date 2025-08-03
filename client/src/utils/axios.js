import axios from "axios";

const instance = axios.create({
  baseURL: "https://fcrm-02g1.onrender.com/api", // ✅ your Render backend
  withCredentials: true, // ✅ needed for cookies/sessions
});

export default instance;
