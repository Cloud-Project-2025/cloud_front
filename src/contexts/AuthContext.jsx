// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearToken } from "../lib/auth";
import { mockUsers } from "../mock/mockData.js"; // ★ 더미 유저 불러오기

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // ============================
  // ⭐ 테스트 모드: 자동 로그인 없음
  // ============================
  useEffect(() => {
    setReady(true);
  }, []);

  // ============================
  // 🔥 더미 로그인
  // ============================
  const login = async (email, password) => {
    // mockUsers 에 있는 유저인지 확인
    const found = mockUsers.find((u) => u.email === email);
    if (!found) {
      throw new Error("Invalid email or password");
    }

    // 비밀번호는 무시하고 이메일만 체크
    setUser(found);
    return true;
  };

  // ============================
  // 🔥 더미 회원가입
  // ============================
  const register = async (email, password) => {
    mockUsers.push({
      id: mockUsers.length + 1,
      email,
      role: "user",
    });
    setUser({ email, role: "user" });
    return true;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      ready,
      login,
      logout,
      register,
    }),
    [user, ready]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
