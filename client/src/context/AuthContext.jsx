import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        const { data } = await api.post("/auth/refresh-token");
        setAccessToken(data.accessToken);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.user);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRestoreSession();
  }, []);

  const register = async ({ name, email, password, confirmPassword }) => {
    await api.post("/auth/register", { name, email, password, confirmPassword });
  };

  const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
