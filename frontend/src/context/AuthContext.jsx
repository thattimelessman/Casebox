import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, getErrorMessage } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await authAPI.me();
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("casebox_access");
      localStorage.removeItem("casebox_refresh");
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: restore session if token exists and hasn't expired
  useEffect(() => {
    const token = localStorage.getItem("casebox_access");
    if (token) {
      try {
        // Decode without verifying — just check exp
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          fetchMe();
          return;
        }
      } catch {}
    }
    setLoading(false);
  }, [fetchMe]);

  const login = async (username, password) => {
    try {
      const { data } = await authAPI.login(username, password);
      localStorage.setItem("casebox_access", data.access);
      localStorage.setItem("casebox_refresh", data.refresh);
      // Backend returns user info alongside tokens
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: getErrorMessage(err) };
    }
  };

  const register = async (formData) => {
    try {
      await authAPI.register(formData);
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: getErrorMessage(err) };
    }
  };

  const logout = () => {
    localStorage.removeItem("casebox_access");
    localStorage.removeItem("casebox_refresh");
    setUser(null);
  };

  const refreshUser = () => fetchMe();

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
