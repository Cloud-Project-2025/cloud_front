// src/pages/AdminProjects.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { mockProjects } from "../mock/mockData.js";
import { useAuth } from "../contexts/AuthContext.jsx";
// 실제 서비스 예시 API (백엔드 붙일 때 사용)
// import { getAllProjects } from "../services/projectService";

export default function AdminProjects() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [allProjects, setAllProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // ✅ 페이지네이션
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // ✅ 더미 테스트
    setAllProjects(mockProjects);
    setVisibleProjects(mockProjects);
    setPage(1);

    // ✅ 실제 서비스 예시
    /*
    setLoading(true);
    getAllProjects()
      .then((res) => {
        const list = res.data || [];
        setAllProjects(list);
        setVisibleProjects(list);
      })
      .catch((err) => {
        console.error("admin getAllProjects error:", err);
        setAllProjects([]);
        setVisibleProjects([]);
      })
      .finally(() => setLoading(false));
    */
  }, []);

  const handleApplyFilters = (filters) => {
    setLoading(true);
    try {
      const next = applyFilters(allProjects, filters);
      setVisibleProjects(next);
      // 필터 후, 존재하는 아이디만 선택 유지
      setSelectedIds((prev) =>
        prev.filter((id) => next.some((p) => p.id === id)),
      );
      setPage(1);
    } catch (e) {
      console.error(e);
      setVisibleProjects([]);
      setSelectedIds([]);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  const toggleAllVisible = () => {
    if (
      visibleProjects.length > 0 &&
      visibleProjects.every((p) => selectedIds.includes(p.id))
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleProjects.map((p) => p.id));
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    console.log("Admin 삭제 대상 프로젝트:", selectedIds);
    alert(
      `시연용: 실제 삭제는 하지 않고,\n선택된 프로젝트 ID: [${selectedIds.join(
        ", ",
      )}] 를 서버에 보낸다고 가정합니다.`,
    );
  };

  // ✅ 페이지네이션 계산
  const totalCount = visibleProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedProjects = visibleProjects.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <main className="max-w-6xl mx-auto flex gap-6 pt-6 pb-10">
      {/* 왼쪽: 프로젝트 관리 */}
      <section className="flex-1 space-y-3 order-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Projects Management</h2>
            <p className="text-[11px] text-slate-400">
              {user ? `Admin: ${user.email}` : "Admin"}
            </p>

            <button
              type="button"
              className="text-[11px] text-indigo-600 cursor-pointer mt-1 hover:underline"
              onClick={() => nav("/admin/users")}
            >
              User Management &gt;
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                onChange={toggleAllVisible}
                checked={
                  visibleProjects.length > 0 &&
                  visibleProjects.every((p) => selectedIds.includes(p.id))
                }
              />
              <span>{selectedIds.length} selected</span>
            </label>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 rounded-full bg-red-500 text-white text-xs shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>

        {/* 페이지네이션 헤더 */}
        <div className="flex items-center justify-between text-sm text-slate-700">
          <div>
            총{" "}
            <span className="font-semibold text-indigo-600">
              {totalCount}
            </span>{" "}
            개 프로젝트
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-xs text-slate-500">페이지 당</span>
              <select
                className="border rounded-md px-2 py-1 text-xs"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                className="px-2 py-1 border rounded-full disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                className="px-2 py-1 border rounded-full disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
              >
                다음
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : pagedProjects.length ? (
          pagedProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-stretch gap-2 border-b border-transparent"
            >
              <div className="flex items-center px-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(project.id)}
                  onChange={() => toggleOne(project.id)}
                />
              </div>
              <div className="flex-1">
                <ProjectCard
                  project={project}
                  onClick={() => nav(`/projects/${project.id}`)} // 상세보기 이동
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            조건에 맞는 프로젝트가 없습니다.
          </p>
        )}
      </section>

      {/* 오른쪽: 필터 */}
      <aside className="w-[280px] shrink-0 order-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
          <FilterSidebar onApply={handleApplyFilters} />
        </div>
      </aside>
    </main>
  );
}

// ------------------------------
// 필터 적용 함수 (Home과 동일 구조)
// ------------------------------
function applyFilters(list, filters) {
  if (!filters || !Object.keys(filters).length) return list;

  let result = [...list];

  const regions = filters["국가/지역"];
  if (regions && regions.length) {
    result = result.filter((p) => {
      const region = p.country_region || p.country || p.region;
      if (!region) return false;
      return regions.some((r) => region.includes(r));
    });
  }

  const statusArr = filters["진행 상태"];
  if (statusArr && statusArr.length) {
    result = result.filter((p) => statusArr.includes(p.status));
  }

  const themes = filters["주제 영역"];
  if (themes && themes.length) {
    result = result.filter((p) => {
      const theme = p.theme_area || p.theme;
      if (!theme) return false;
      return themes.some((t) => theme.includes(t));
    });
  }

  const orgs = filters["기관"];
  if (orgs && orgs.length) {
    result = result.filter((p) => {
      const inst = p.institution || p.organization;
      if (!inst) return false;
      return orgs.includes(inst);
    });
  }

  const budgetFilters = filters["총사업비"];
  if (budgetFilters && budgetFilters.length) {
    result = result.filter((p) => {
      const raw = p.budget ?? p.total_amount;
      const budget = Number(raw);
      if (!raw || Number.isNaN(budget)) return false;

      return budgetFilters.some((label) => {
        if (label.startsWith("Small")) return budget < 10_000_000;
        if (label.startsWith("Medium"))
          return budget >= 10_000_000 && budget < 50_000_000;
        if (label.startsWith("Large")) return budget >= 50_000_000;
        return true;
      });
    });
  }

  const coFilters = filters["공동재원"];
  if (coFilters && coFilters.length) {
    result = result.filter((p) => {
      const raw = p.co_financing ?? p.cofinancing;
      const num =
        raw === null || raw === undefined || raw === "" ? null : Number(raw);

      return coFilters.some((label) => {
        if (label === "None / Unknown")
          return num === null || Number.isNaN(num);
        if (label.startsWith("Small"))
          return num !== null && !Number.isNaN(num) && num < 10_000_000;
        if (label.startsWith("Medium"))
          return (
            num !== null &&
            !Number.isNaN(num) &&
            num >= 10_000_000 &&
            num < 50_000_000
          );
        if (label.startsWith("Large"))
          return num !== null && !Number.isNaN(num) && num >= 50_000_000;
        return true;
      });
    });
  }

  return result;
}
