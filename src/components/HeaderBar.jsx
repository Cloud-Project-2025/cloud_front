// src/components/HeaderBar.jsx
import { useLocation, useNavigate } from "react-router-dom";

function HeaderButton({ children, active, className = "", ...rest }) {
  return (
    <button
      {...rest}
      className={
        "px-3 py-1.5 rounded-full text-sm border transition shadow-sm " +
        (active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100") +
        " " +
        className
      }
    >
      {children}
    </button>
  );
}

export default function HeaderBar({ isAuthed, onLogout }) {
  const nav = useNavigate();
  const loc = useLocation();

  const goHome = () => nav("/");
  const goManage = () => nav("/me/projects");
  const goAddProject = () => nav("/projects/new");
  const goLogin = () => nav("/login");

  const handleLogout = () => {
    onLogout?.();
    nav("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* 로고 / 타이틀 */}
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2"
        >
          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            EC
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900 tracking-tight">
              eco-db
            </span>
            <span className="text-[11px] text-slate-400">
              climate finance projects
            </span>
          </div>
        </button>

        {/* 검색창 */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 우측 메뉴 */}
        <nav className="flex items-center gap-2">
          <HeaderButton
            type="button"
            onClick={goManage}
            active={loc.pathname.startsWith("/me")}
          >
            Manage
          </HeaderButton>
          <HeaderButton
            type="button"
            onClick={goAddProject}
            active={loc.pathname.startsWith("/projects/new")}
          >
            Add Project
          </HeaderButton>

          {/* ⬇ 여기 LOGIN / LOGOUT 버튼 색상 확실하게 수정 */}
          {isAuthed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white border border-indigo-600 shadow-sm hover:bg-indigo-700"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={goLogin}
              className="px-4 py-2 rounded-full text-sm font-medium border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 shadow-sm"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
