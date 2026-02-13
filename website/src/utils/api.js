import axios from "axios";
const vApiUrl = import.meta.env.VITE_API_URL;
const API_URL =
  vApiUrl && vApiUrl !== "undefined" ? vApiUrl : "http://localhost:5000";
export const SOCKET_URL = API_URL;
export const BASE_URL = `${API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  console.log("📡 Request interceptor - Token:", token);
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("📡 Added Authorization header");
  } else {
    console.log("⚠️ No valid token to add to request");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      "❌ Response error:",
      error.response?.status,
      error.config?.url,
    );
    if (error.response?.status === 401) {
      console.log("🚨 401 Unauthorized - Clearing tokens");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Prevent redirect loop if already on login or register page
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      console.log(
        "🔍 Current path:",
        window.location.pathname,
        "Is auth page?",
        isAuthPage,
      );
      if (!isAuthPage) {
        console.log("↩️ Redirecting to /login");
        window.location.href = "/login";
      } else {
        console.log("⏸️ Already on auth page, skipping redirect");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
