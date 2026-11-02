import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("sdp_token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sdp_user"));
    } catch {
      return null;
    }
  });
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });

  const openAuth = useCallback((mode = "login") => setAuthModal({ open: true, mode }), []);
  const closeAuth = useCallback(() => setAuthModal({ open: false, mode: "login" }), []);

  const persist = useCallback((data) => {
    localStorage.setItem("sdp_token", data.access_token);
    localStorage.setItem("sdp_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api.login(email, password);
      persist(data);
      return data;
    },
    [persist]
  );

  const register = useCallback(
    async (name, email, password) => {
      const data = await api.register(name, email, password);
      persist(data);
      return data;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("sdp_token");
    localStorage.removeItem("sdp_user");
    setToken(null);
    setUser(null);
  }, []);

  // Re-validate a stored token on load
  useEffect(() => {
    if (token && !user) {
      api
        .me()
        .then(setUser)
        .catch(() => logout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, authModal, openAuth, closeAuth, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
