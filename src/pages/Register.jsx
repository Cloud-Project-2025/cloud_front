import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  // useAuth에 register 메서드가 없다면 실제 함수명으로 바꿔 쓰세요 (ex. signup)
  const { register: signUp } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !pw.trim()) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }
    if (pw.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      await signUp({ email, password: pw }); // name 안 쓰는 백엔드 기준
      nav("/");
    } catch (err) {
      setError(err?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center items-start font-['Poppins']">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-16">
        <h1 className="text-2xl font-medium text-black">Register</h1>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full h-12 rounded-md bg-[#F0EFFF] px-4 text-sm text-[#333] placeholder-[#A7A3FF] outline-none focus:ring-2 focus:ring-[#625BF7]/50"
          />

          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="w-full h-12 rounded-md bg-[#F0EFFF] px-4 text-sm text-[#333] placeholder-[#A7A3FF] outline-none focus:ring-2 focus:ring-[#625BF7]/50"
          />

          <div className="relative">
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-12 rounded-md bg-[#F0EFFF] px-4 pr-10 text-sm text-[#333] placeholder-[#A7A3FF] outline-none focus:ring-2 focus:ring-[#625BF7]/50"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7A3FF] select-none"
              aria-hidden
            >
              🔒
            </span>
          </div>

          {error && (
            <p className="text-center text-[#F94D4D] text-base leading-6">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 rounded-lg text-white font-medium text-sm shadow-[0_4px_16px_rgba(77,71,195,0.4)] transition ${
              loading ? "bg-[#4D47C3]/60 cursor-not-allowed" : "bg-[#4D47C3] hover:opacity-95"
            }`}
          >
            {loading ? "Processing..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#333333]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#625BF7] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
