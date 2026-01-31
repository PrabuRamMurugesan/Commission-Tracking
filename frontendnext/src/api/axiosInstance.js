import axios from "axios";

// Use local API when app is opened from localhost (local testing); otherwise use VITE_API_URL (prod/staging)
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location?.hostname && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) ? `${envUrl}/api` : "http://localhost:3000/api";
  }
  return envUrl ? `${envUrl.replace(/\/$/, "")}/api` : "/api";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
