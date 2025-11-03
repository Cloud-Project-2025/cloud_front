export default function ActionsBar() {
  return (
    <div className="flex items-center justify-between mt-4 gap-3">
      <div className="flex items-center gap-3">
        {/* 버튼 이름을 FILTER 로 변경 */}
        <button className="h-10 px-3 rounded-[10px] border border-gray-200 bg-white inline-flex items-center gap-2">
          <span>FILTER</span>
          <span className="opacity-60">▾</span>
        </button>

        <label className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">⌕</span>
          <input
            className="h-10 w-[460px] pl-8 pr-9 rounded-[10px] border border-gray-200 bg-white"
            placeholder="Search by project / country / agency"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] rounded px-1.5 py-0.5 border border-gray-200 bg-gray-100 text-gray-500">
            /
          </kbd>
        </label>
      </div>

      <button className="h-10 px-4 rounded-[10px] bg-[#4f46e5] text-white font-semibold">
        + New project
      </button>
    </div>
  );
}
