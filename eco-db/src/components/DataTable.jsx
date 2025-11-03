import { useMemo, useState, useRef, useEffect } from "react";

function Th({ children, className = "", onClick, sortable }) {
  return (
    <th
      onClick={onClick}
      className={`text-left font-semibold px-4 py-3 border-b border-gray-100 ${sortable ? "cursor-pointer select-none" : ""} ${className}`}
    >
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 border-b border-gray-100 align-middle ${className}`}>{children}</td>;
}

function StatusBadge({ status = "" }) {
  const s = status.trim();
  let cls = "bg-gray-100 text-gray-700 border-gray-200"; // 예정
  if (s === "진행 중") cls = "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (s === "완료") cls = "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`inline-flex items-center gap-2 h-5 px-2 rounded-full text-xs font-semibold border ${cls}`}>
      {status || "—"}
    </span>
  );
}

export default function DataTable({ rows = [], search = "", statusFilter = "" }) {
  // 정렬
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openRpp, setOpenRpp] = useState(false);
  const rppRef = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (rppRef.current && !rppRef.current.contains(e.target)) setOpenRpp(false); };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // 필터 + 검색  👉 region 사용
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      const okStatus = statusFilter ? (r.status === statusFilter) : true;
      const okSearch = !q ? true : [
        r.name, r.country, r.region, r.status
      ].some(v => String(v ?? "").toLowerCase().includes(q));
      return okStatus && okSearch;
    });
  }, [rows, search, statusFilter]);

  // 정렬  👉 region 정렬 가능
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      if (av === bv) return 0;
      if (sortDir === "asc") return av.localeCompare(bv, undefined, { numeric: true });
      return bv.localeCompare(av, undefined, { numeric: true });
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const maxPage = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = Math.min(page * rowsPerPage, total);
  const current = sorted.slice(startIdx, endIdx);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  useEffect(() => { setPage(1); }, [rowsPerPage, search, statusFilter]);

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow">
      <table className="w-full border-separate border-spacing-0 text-[14px]">
        <thead className="bg-[#fafafa] text-gray-500">
          <tr>
            <Th sortable onClick={()=>toggleSort("projNum")}>PROJECTN NUM</Th>
            <Th sortable onClick={()=>toggleSort("name")}>PROJECT NAME</Th>
            <Th sortable onClick={()=>toggleSort("status")}>STATUS</Th>
            <Th sortable onClick={()=>toggleSort("region")}>REGION</Th> {/* ← 여기 */}
            <Th sortable onClick={()=>toggleSort("country")}>COUNTRY</Th>
            <Th>PROJECT TIMELINE</Th>
            <Th className="text-right" sortable onClick={()=>toggleSort("financing")}>FINANCING</Th>
          </tr>
        </thead>

        <tbody>
          {current.length === 0 ? (
            <tr>
              <Td className="py-12 text-center text-gray-500" colSpan={7}>
                No results. Try adjusting filters or search terms.
              </Td>
            </tr>
          ) : current.map((r, i) => (
            <tr key={r.id ?? i} className="hover:bg-[#fafbff]">
              <Td>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border border-gray-300" />
                  <span className="text-gray-700">{r.projNum ?? "—"}</span>
                </div>
              </Td>
              <Td>
                <a href={r.href ?? "#"} className="text-indigo-600 font-semibold hover:underline">
                  {r.name}
                </a>
              </Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>{r.region ?? "—"}</Td>   {/* ← REGION 표시 */}
              <Td>{r.country ?? "—"}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center h-7 px-2 rounded-[9px] border border-gray-200 bg-white">
                    {r.start ?? "—"}
                  </span>
                  <span className="opacity-50">›</span>
                  <span className="inline-flex items-center h-7 px-2 rounded-[9px] border border-gray-200 bg-white">
                    {r.end ?? "—"}
                  </span>
                </div>
              </Td>
              <Td className="text-right">{r.financing ?? "—"}</Td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 하단 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm text-gray-500">
          {total === 0 ? "0 of 0" : `${startIdx + 1}–${endIdx} of ${total}`}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={rppRef}>
            <button
              onClick={()=>setOpenRpp(v=>!v)}
              className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-600 inline-flex items-center gap-2"
            >
              Rows per page: {rowsPerPage} <span className="opacity-60">▾</span>
            </button>
            {openRpp && (
              <div className="absolute right-0 mt-2 w-28 rounded-lg border border-gray-200 bg-white shadow p-1">
                {[5,10,15,20,30,40,50].map(n=>(
                  <button
                    key={n}
                    onClick={()=>{ setRowsPerPage(n); setOpenRpp(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-md ${rowsPerPage===n ? "bg-indigo-600 text-white" : "hover:bg-gray-50"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              className="h-8 w-8 rounded-md border border-gray-200 bg-white disabled:opacity-50"
              onClick={()=>setPage(p=>Math.max(1,p-1))}
              disabled={page===1}
              aria-label="Previous page"
            >‹</button>
            <span>{page} / {maxPage}</span>
            <button
              className="h-8 w-8 rounded-md border border-gray-200 bg-white disabled:opacity-50"
              onClick={()=>setPage(p=>Math.min(maxPage,p+1))}
              disabled={page===maxPage}
              aria-label="Next page"
            >›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
