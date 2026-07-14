import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-powered-debt-relief.onrender.com"
});

export default api;