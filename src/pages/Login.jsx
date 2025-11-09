import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, pw);
      nav("/");
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
