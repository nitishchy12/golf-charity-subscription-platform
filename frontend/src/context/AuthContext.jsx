import { createContext, useContext, useEffect, useState } from "react";
import { authApi, userApi } from "../api/endpoints";

const AuthContext = createContext(null);

const STORAGE_KEY = "golf-auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    if (!auth?.token) {
      setLoading(false);
      return;
    }

    userApi
      .me()
      .then(({ data }) => {
        const nextAuth = { ...auth, user: data.data.user };
        setAuth(nextAuth);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAuth(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (payload) => {
    const nextAuth = { token: payload.token, user: payload };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const signup = async (payload) => {
    const response = await authApi.signup(payload);
    persist(response.data.data);
    return response;
  };

  const login = async (payload) => {
    const response = await authApi.login(payload);
    persist(response.data.data);
    return response;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const refreshProfile = async () => {
    const response = await userApi.me();
    const nextAuth = { ...auth, user: response.data.data.user };
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth?.user || null,
        token: auth?.token || null,
        isAuthenticated: Boolean(auth?.token),
        isAdmin: auth?.user?.role === "admin",
        loading,
        signup,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
