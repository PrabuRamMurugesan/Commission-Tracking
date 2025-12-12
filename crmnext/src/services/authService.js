import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const signup = async (username, email, mobile, password) => {
  return axios.post(`${API_BASE_URL}/signup`, {
    username,
    email,
    mobile,
    password,
  });
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data.token) {
      console.log("Received Token:", response.data.token); // ✅ Debugging log
      localStorage.setItem("token", response.data.token); // ✅ Store token in Local Storage
    } else {
      console.error("No token received from backend!");
    }

    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Invalid email or password!" };
  }
};
