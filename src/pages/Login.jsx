// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
// import { mockUsers } from "../mock/mockData.js"; // 필요하면 프론트 단에서만 테스트용으로 사용할 수 있음

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  /**
   * ✅ 실제 서비스
   *   - AuthContext.login(email, pw) 내부에서
   *     백엔드 API(/api/auth/login 등)를 호출한다고 가정
   *
   * ✅ 더미 테스트 (설명용)
   *   - mockUsers 에 있는 계정 예시:
   *      admin@aaa.com (admin)
   *      aaa@aaa.com   (user)
   *      bbb@bbb.com   (user)
   *   - 지금 코드는 login()을 그대로 호출하므로,
   *     실제 테스트할 때는 백엔드 쪽에서 위 계정을 만들어두면 됨.
   */

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      // 실제 서비스: AuthContext.login 사용
      await login(email, pw);
      nav("/");

      // 프론트 단에서만 더미 로그인 강제로 쓰고 싶으면(예시):
      // 1) 위 login(email, pw) 주석 처리
      // 2) 아래 코드 참고
      //
      // const found = mockUsers.find((u) => u.email === email);
      // if (!found) {
      //   setError("테스트 계정이 존재하지 않습니다.");
      //   return;
      // }
      // // 여기서 localStorage 등에 더미 토큰 저장 후 새로고침 등
      // nav("/");

    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-16">
        <h1 className="text-2xl font-medium text-black">Login</h1>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full h-12 rounded-md bg-[#F0EFFF] px-4 text-sm text-[#333] placeholder-[#A7A3FF] outline-none focus:ring-2 focus:ring-[#625BF7]/50"
          />

          <div className="relative">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="w-full h-12 rounded-md bg-[#F0EFFF] px-4 pr-10 text-sm text-[#333] placeholder-[#A7A3FF] outline-none focus:ring-2 focus:ring-[#625BF7]/50"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7A3FF] select-none"
              aria-hidden
            >
              👁️
            </span>
          </div>

          {error && (
            <p className="text-center text-[#F94D4D] text-base leading-6">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-[#4D47C3] text-white font-medium text-sm shadow-[0_4px_16px_rgba(77,71,195,0.4)] hover:opacity-95 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#333]">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#625BF7] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
