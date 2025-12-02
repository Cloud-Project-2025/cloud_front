// src/components/HeaderBar.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HeaderBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="bg-[#F5F7FB] border-b border-slate-200 h-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4">

        {/* 로고 */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => nav("/")}>
          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            EC
          </div>
          <div>
            <div className="text-sm font-semibold">eco-db</div>
            <div className="text-[10px] text-gray-500 -mt-1">climate finance projects</div>
          </div>
        </div>

        {/* 검색창 + 버튼 */}
        <div className="flex items-center flex-1 mx-10 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full h-10 rounded-full border border-gray-300 pl-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* 검색 버튼 */}
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center hover:bg-indigo-600 active:scale-95 shadow"
            >
              🔍
            </button>
          </div>
        </div>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav("/manage")}
            className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm shadow-sm hover:bg-gray-100"
          >
            Manage
          </button>
          <button
            onClick={() => nav("/projects/new")}
            className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm shadow-sm hover:bg-gray-100"
          >
            Add Project
          </button>
          <button
            onClick={logout}
            className="px-4 py-1.5 bg-indigo-500 rounded-full text-white text-sm shadow hover:bg-indigo-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
