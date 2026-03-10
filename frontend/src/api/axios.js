import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
});

// Auto-attach JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("casebox_access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("casebox_refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL || "http://localhost:8000/api"}/token/refresh/`,
            { refresh }
          );
          localStorage.setItem("casebox_access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return API(original);
        } catch {
          localStorage.removeItem("casebox_access");
          localStorage.removeItem("casebox_refresh");
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default API;
