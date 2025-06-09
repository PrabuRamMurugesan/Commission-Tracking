import axios from "axios";

// Backend API URL (Next.js)
const API_BASE_URL = "http://localhost:3000/api";

export const getCommissions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/commissions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching commissions:", error);
  }
};
