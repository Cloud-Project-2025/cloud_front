// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setToken, getToken, clearToken } from "../lib/auth";
import { loginReq, meReq, registerReq } from "../services/authService";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (!t) { setReady(true); return; }
    meReq().then(setUser).catch(() => clearToken()).finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await loginReq({ email, password });
    if (!token) throw new Error("No token returned");
    setToken(token);
    setUser(user || { email });
    return true;
  };

  const register = async (email, password) => {
    const { token, user } = await registerReq({ email, password });
    if (token) setToken(token);
    if (user) setUser(user);
    return true;
  };

  const logout = () => { clearToken(); setUser(null); };

  const value = useMemo(() => ({ user, isAuthed: !!user, ready, login, logout, register }), [user, ready]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
export function useAuth() { return useContext(AuthCtx); }
