// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setToken, getToken, clearToken } from "../lib/auth";
import { loginReq, meReq, registerReq } from "../services/authService";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  // 원래코드
  // useEffect(() => {
  //   const t = getToken();
  //   if (!t) { setReady(true); return; }
  //   meReq().then(setUser).catch(() => clearToken()).finally(() => setReady(true));
  // }, []);
  // 테스트용
  useEffect(() => {
    // DB 연동 없이 임시로 로그인 상태를 만들기 위해 user를 설정
    // 실제로는 로그인 API와 연결해야 하지만, 로컬 상태로 우회 처리
    // 예시로 admin 계정으로 로그인 상태 설정
    setUser({ email: "admin@admin.com" });  // 임시 로그인 상태 설정
    setReady(true);  // 준비 완료
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
