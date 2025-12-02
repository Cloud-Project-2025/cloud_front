// src/contexts/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setToken, getToken, clearToken } from "../lib/auth";
import { loginReq, registerReq } from "../services/authService";

const USER_KEY = "auth_user";
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // 처음 로드 시 localStorage에서 토큰/유저 복원
  useEffect(() => {
    const token = getToken();
    const raw = localStorage.getItem(USER_KEY);

    if (token && raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch {
        // 파싱 실패하면 토큰/유저 정보 초기화
        clearToken();
        localStorage.removeItem(USER_KEY);
        setUser(null);
      }
    }

    setReady(true);
  }, []);

  // 로그인 (Login.jsx에서 login(email, pw) 호출)
  const login = async (email, password) => {
    const { token, user } = await loginReq({ email, password });
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  // 회원가입 (Register.jsx에서 register({ email, password }) 호출)
  const register = async ({ email, password }) => {
    const { token, user } = await registerReq({ email, password });
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  // 로그아웃
  const logout = () => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthed: !!user, // ProtectedRoute에서 사용
      login,
      register,
      logout,
    }),
    [user, ready]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
