export default function HeaderBar({ onSearch, isAuthed = false, onLogout }) {
  return (
    <header className="w-full h-20 bg-[#d9d9d9] flex items-center">
      <div className="mx-auto w-full max-w-6xl px-4 flex items-center gap-3">
        {/* ✅ 왼쪽 칸 → Home 링크로 변경 */}
        <a
          href="/"
          className="w-[215px] h-16 bg-white rounded-sm flex items-center justify-center text-[18px] font-medium text-[#333] hover:bg-[#ececec] transition"
        >
          Home
        </a>

        {/* 🔍 검색창 */}
        <div className="flex-1">
          <div className="h-[41px] rounded-md bg-white shadow-[0px_1.2px_2.4px_rgba(0,0,0,0.06),0_0_0_1.2px_rgba(134,143,160,0.4)] flex items-center px-3">
            <input
              className="w-full outline-none text-[16.98px] placeholder-[#A1A9B8]"
              placeholder="Search"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* ⚙️ 우측 버튼들 */}
        <nav className="flex items-center gap-2">
          <a
            href="/admin/projects"
            className="h-16 w-[110px] bg-white grid place-items-center text-[16.98px]"
          >
            Manage
          </a>
          <a
            href="/add"
            className="h-16 w-[110px] bg-white grid place-items-center text-[16.98px]"
          >
            Add Project
          </a>

          {isAuthed ? (
            <button
              onClick={onLogout}
              className="h-16 w-[110px] bg-white grid place-items-center text-[16.98px]"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="h-16 w-[110px] bg-white grid place-items-center text-[16.98px]"
            >
              Login
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
