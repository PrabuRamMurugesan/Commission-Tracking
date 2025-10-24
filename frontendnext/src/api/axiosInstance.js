import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ Fix this
  withCredentials: true, // ✅ Important for sending cookies or headers

  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
