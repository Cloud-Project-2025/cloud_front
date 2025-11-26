// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { mockProjects } from "../mock/mockData.js";
// import { getAllProjects } from "../services/projectService"; // 실제 서비스용 예시

export default function Home() {
  const nav = useNavigate();

  // ✅ 더미 테스트: 처음에 mockProjects로 화면 채우기
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false);

  /**
   * ✅ 실제 서비스 예시 (백엔드에서 프로젝트 목록 가져오기)
   *
   * async function fetchProjectsFromApi(filters) {
   *   setLoading(true);
   *   try {
   *     const res = await getAllProjects(filters); // 예: /api/projects?...
   *     const list = res.data || [];
   *     setProjects(list);
   *   } catch (e) {
   *     console.error("프로젝트 목록 불러오기 실패:", e);
   *     setProjects([]);
   *   } finally {
   *     setLoading(false);
   *   }
   * }
   *
   * 현재는 보고서용 화면 확인을 위해
   * → mockProjects에 필터만 적용하는 함수 사용 중
   */

  const fetchProjects = async (filters) => {
    setLoading(true);
    try {
      const next = applyFilters(mockProjects, filters);
      setProjects(next);
    } catch (e) {
      console.error(e);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* 왼쪽: 소개 + 프로젝트 리스트 */}
      <section className="flex-1 space-y-4">
        {/* 상단 소개 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Climate Finance Project Library
          </h2>
          <p className="text-sm text-slate-600">
            GCF, GEF 등 주요 기후금융 기구들의 프로젝트를 한 곳에서 탐색하고
            비교할 수 있는 프로젝트 라이브러리입니다. 오른쪽 필터를 이용해
            국가, 분야, 자금 규모 등으로 원하는 프로젝트를 찾아보세요.
          </p>
        </div>

        {/* 프로젝트 카드들 */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : projects.length ? (
            projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => nav(`/projects/${p.id}`)}
              />
            ))
          ) : (
            <p className="text-sm text-slate-400">검색 결과가 없습니다.</p>
          )}
        </div>
      </section>

      {/* 오른쪽: 필터 카드 */}
      <aside className="w-[280px] shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
          <FilterSidebar onApply={fetchProjects} />
        </div>
      </aside>
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
