// src/components/HeaderBar.jsx
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function HeaderBar() {
  const nav = useNavigate();
  const { user, isAuthed, logout } = useAuth();

  const handleLogoClick = () => {
    nav("/");
  };

  const handleManageClick = () => {
    if (!user) {
      nav("/login");
      return;
    }
    // 👇 role에 따라 다른 관리 페이지
    if (user.role === "admin") {
      nav("/admin/projects");      // 관리자: 전체 프로젝트 관리
    } else {
      nav("/me/projects");         // 일반 사용자: 내 프로젝트 관리
    }
  };

  const handleAddProject = () => {
    if (!user) {
      nav("/login");
      return;
    }
    nav("/projects/new");
  };

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#F5F7FB] border-b border-slate-200">
      {/* 왼쪽 로고 + 텍스트 */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
          EC
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-900">eco-db</span>
          <span className="text-[11px] text-slate-500">
            climate finance projects
          </span>
        </div>
      </button>

      {/* 가운데 검색바 (현재는 동작만 형식적으로) */}
      <div className="flex-1 max-w-3xl mx-6">
        <div className="w-full h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center px-4">
          <input
            type="text"
            placeholder="Search projects..."
            className="flex-1 text-sm text-slate-700 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* 오른쪽 버튼들 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleManageClick}
          className="h-9 px-4 rounded-full bg-white border border-slate-200 text-sm text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Manage
        </button>

        <button
          type="button"
          onClick={handleAddProject}
          className="h-9 px-4 rounded-full bg-white border border-slate-200 text-sm text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Add Project
        </button>

        {isAuthed ? (
          <button
            type="button"
            onClick={handleLogout}
            className="h-9 px-5 rounded-full bg-indigo-500 text-sm text-white font-medium shadow-md hover:bg-indigo-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="h-9 px-5 rounded-full bg-indigo-500 text-sm text-white font-medium shadow-md flex items-center justify-center hover:bg-indigo-600"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
