import React, { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MOCK } from "../data/mock.js";
import Badge from "../components/Badge.jsx";
import Chip from "../components/Chip.jsx";
import StatusPanel from "../components/StatusPanel.jsx";

const tone = {
  PLANNED: "bg-gray-100 text-gray-700 border border-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};
const readable = (s) =>
  s === "PLANNED" ? "Planned" : s === "IN_PROGRESS" ? "In progress" : "Completed";
const fmtDate = (s) => (s ? new Date(s).toLocaleDateString() : "-");
const money = (n) =>
  n == null ? "-" : n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Projects() {
  const [search, setSearch] = useState("");
  const [expandedRowId, setExpandedRowId] = useState(null);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...MOCK];
    if (q)
      list = list.filter((p) =>
        [p.title, p.agency_name, p.country_iso3].some((s) => (s || "").toLowerCase().includes(q))
      );
    return list;
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* 페이지 타이틀 */}
      <h1 className="text-2xl font-semibold">Projects</h1>

      {/* 상단 툴바 박스 */}
      <div className="mt-3 rounded-xl border bg-white p-3">
        <div className="flex items-center gap-2">
          {/* Filter 버튼 (모양용) */}
          <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
            <span className="text-gray-600">▾</span>
            <span>All</span>
          </button>

          {/* 검색 */}
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-3.5-3.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project / country / agency"
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* New project */}
          <button className="ml-auto rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700">
            + New project
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="w-10 p-3"></th>
              <th className="w-10 p-3 text-left">#</th>
              <th className="p-3 text-left">Project name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Region</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Project timeline</th>
              <th className="p-3 text-left">Financing</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {items.map((p, idx) => (
              <Fragment key={p.id}>
                <tr className={expandedRowId === p.id ? "bg-indigo-50/30" : ""}>
                  {/* 펼침 버튼 */}
                  <td className="p-3">
                    <button
                      aria-expanded={expandedRowId === p.id}
                      onClick={() => setExpandedRowId((prev) => (prev === p.id ? null : p.id))}
                      className="rounded-full border w-7 h-7 grid place-items-center hover:bg-gray-50">
                      <span
                        className={`inline-block transition-transform ${
                          expandedRowId === p.id ? "rotate-90" : ""
                        }`}>
                        ▶
                      </span>
                    </button>
                  </td>

                  <td className="p-3 text-gray-500">{idx + 1}</td>

                  <td className="p-3">
                    <Link className="text-indigo-600 hover:underline" to={`/projects/${p.id}`}>
                      {p.title}
                    </Link>
                    {/* 보조정보 라인 */}
                    <div className="mt-0.5 text-xs text-gray-500">{p.external_id || "-"}</div>
                  </td>

                  <td className="p-3">
                    <Badge className={tone[p.status]}>{readable(p.status)}</Badge>
                  </td>

                  <td className="p-3">
                    <Chip className="uppercase">{p.region_group || "-"}</Chip>
                  </td>

                  <td className="p-3">{p.country_iso3 || (p.scope === "REGIONAL" ? "—" : "-")}</td>

                  {/* Timeline 칩 2개 + '>' 구분 */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Chip>{fmtDate(p.start_date)}</Chip>
                      <span className="text-gray-400">›</span>
                      <Chip>{fmtDate(p.end_date)}</Chip>
                    </div>
                  </td>

                  <td className="p-3">{money(p.budget_usd)}</td>
                </tr>

                {expandedRowId === p.id && (
                  <tr>
                    <td colSpan={8} className="bg-white">
                      <StatusPanel p={p} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
