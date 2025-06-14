import axios from "axios";
const API_URL = "http://localhost:4000/auth";

export const signupUser = async (username, email, password) => {
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      return { success: false, message: "All fields are required" };
    }
    try {
      const response = await axios.post(`${API_URL}/signup`, { username, email, password });
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Signup failed. Please try again." 
      };
    }
};

export const loginUser = async (email, password) => {
    if (email.trim() === "" || password.trim() === "") {
      return { success: false, message: "Email and password are required" };
    }
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed. Please try again." 
      };
    }
};
