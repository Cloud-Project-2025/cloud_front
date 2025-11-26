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

  useEffect(() => {
    // ✅ 실제 서비스용 (백엔드 붙일 때 이 블록을 살리고, mock 부분은 지우면 됨)
    /*
    setLoading(true);
    getAllProjects()
      .then((res) => {
        const list = res.data || [];
        setAllProjects(list);
        setVisibleProjects(list);
      })
      .catch((err) => {
        console.error("getAllProjects 실패, mock으로 대체:", err);
        setAllProjects(mockProjects);
        setVisibleProjects(mockProjects);
      })
      .finally(() => setLoading(false));
    */

    // ✅ 현재 보고서 / 데모용: 프론트 더미 데이터 사용
    setAllProjects(mockProjects);
    setVisibleProjects(mockProjects);
  }, []);

  const handleApplyFilters = (filters) => {
    setLoading(true);
    try {
      const next = applyFilters(allProjects, filters);
      setVisibleProjects(next);
      // 필터 후, 존재하는 아이디만 선택 유지
      setSelectedIds((prev) =>
        prev.filter((id) => next.some((p) => p.id === id))
      );
    } catch (e) {
      console.error(e);
      setVisibleProjects([]);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = visibleProjects.map((p) => p.id);
    const allSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`${selectedIds.length}개 프로젝트를 삭제할까요? (더미)`))
      return;

    const leftAll = allProjects.filter((p) => !selectedIds.includes(p.id));
    const leftVisible = visibleProjects.filter(
      (p) => !selectedIds.includes(p.id)
    );

    setAllProjects(leftAll);
    setVisibleProjects(leftVisible);
    setSelectedIds([]);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* 오른쪽 필터 */}
      <aside className="w-[280px] shrink-0 order-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
          <FilterSidebar onApply={handleApplyFilters} />
        </div>
      </aside>

      {/* 왼쪽 프로젝트 관리 */}
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

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : visibleProjects.length ? (
          visibleProjects.map((project) => (
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
          <p className="text-sm text-slate-400 mt-4">No projects found.</p>
        )}
      </section>
    </main>
  );
}

function applyFilters(list, filters) {
  if (!filters || !Object.keys(filters).length) return list;

  let result = [...list];

  // 1) 국가 / 지역
  const regions = filters["국가/지역"];
  if (regions && regions.length) {
    result = result.filter((p) => {
      const region = p.country_region || p.country;
      if (!region) return false;
      return regions.some((r) => region.includes(r));
    });
  }

  // 2) 진행 상태
  const statusArr = filters["진행 상태"];
  if (statusArr && statusArr.length) {
    result = result.filter((p) => statusArr.includes(p.status));
  }

  // 3) 주제 영역 (Adaptation / Mitigation / Cross-cutting)
  const themes = filters["주제 영역"];
  if (themes && themes.length) {
    result = result.filter((p) => {
      const theme = p.theme_area || p.theme;
      if (!theme) return false;
      return themes.includes(theme);
    });
  }

  // 4) 기관명 (UNDP, WorldBank, ADB 등)
  const orgs = filters["기관명"];
  if (orgs && orgs.length) {
    result = result.filter((p) => {
      const inst = p.institution || p.organization;
      if (!inst) return false;
      return orgs.includes(inst);
    });
  }

  // 5) 총 사업비 (budget / total_amount)
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

  // 6) 공동재원 (co_financing / cofinancing)
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

