// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { mockProjects } from "../mock/mockData.js";
// import { getAllProjects } from "../services/projectService"; // 실제 서비스용 예시

export default function Home() {
  const nav = useNavigate();

  // ✅ 더미 데이터로 시작
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false);

  // ✅ 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 10 / 20 / 50

  /**
   * ✅ 현재는 mockProjects에 필터만 적용하는 함수 사용 중
   *    (FilterSidebar → onApply(payload) 구조)
   */
  const fetchProjects = async (filters) => {
    setLoading(true);
    try {
      const next = applyFilters(mockProjects, filters);
      setProjects(next);
      setPage(1); // 필터 적용 시 첫 페이지로 이동
    } catch (e) {
      console.error(e);
      setProjects([]);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지네이션 계산
  const totalCount = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedProjects = projects.slice(startIndex, startIndex + pageSize);

  return (
    <main className="max-w-6xl mx-auto flex gap-6 pt-6 pb-10 min-h-screen">
      {/* 왼쪽: 리스트 */}
      <section className="flex-1 min-w-0 space-y-4 min-h-[700px]">
        {/* 설명 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4">
          <h1 className="text-xl font-semibold mb-1">
            eco-db 환경·기후 프로젝트 라이브러리
          </h1>
          <p className="text-sm text-slate-600">
            다양한 기관에서 수행하는 기후·환경 관련 프로젝트를 한눈에 보고,
            국가, 분야, 자금 규모 등으로 필터링하여
            비교할 수 있는 프로젝트 라이브러리입니다. 오른쪽 필터를 이용해
            국가, 분야, 자금 규모 등으로 원하는 프로젝트를 찾아보세요.
          </p>
        </div>

        {/* 목록 헤더 + 페이지네이션 컨트롤 */}
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

        {/* 프로젝트 카드들 */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : pagedProjects.length ? (
            pagedProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => nav(`/projects/${p.id}`)}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">
              조건에 맞는 프로젝트가 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* 오른쪽: 필터 */}
      <aside className="w-[280px] shrink-0">
        {/* 새 FilterSidebar가 자체적으로 aside/sticky를 가지고 있어서
            여기서는 그냥 래핑만 해줌 */}
        <FilterSidebar onApply={fetchProjects} sourceProjects={mockProjects} />
      </aside>
    </main>
  );
}

// ------------------------------
// 🔽 새 필터 적용 함수
//   - FilterSidebar에서 내려주는 payload 구조에 맞춤
//   - DB 설계 컬럼을 최대한 반영
// ------------------------------
function applyFilters(list, filters) {
  if (!filters || !Object.keys(filters).length) return list;

  let result = [...list];

  // 🔹 Helper: 숫자 안전 변환
  const toNum = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  // 🔹 진행 상태 (status)
  if (filters.status && filters.status.length) {
    const selected = filters.status;
    result = result.filter((p) => selected.includes(p.status));
  }

  // 🔹 국가 / 지역 (country_region)
  if (filters.country_region && filters.country_region.length) {
    const selected = filters.country_region;
    result = result.filter((p) => {
      const region = p.country_region || p.country || p.region;
      if (!region) return false;
      return selected.some((r) => region.includes(r));
    });
  }

  // 🔹 주제 분야 (theme_area)
  if (filters.theme_area && filters.theme_area.length) {
    const selected = filters.theme_area;
    result = result.filter((p) => {
      const theme = p.theme_area || p.theme;
      if (!theme) return false;
      return selected.some((t) => theme.includes(t));
    });
  }

  // 🔹 출처 사이트 (site)
  if (filters.site && filters.site.length) {
    const selected = filters.site;
    result = result.filter((p) => {
      const site = p.site || p.source_site;
      if (!site) return false;
      return selected.includes(site);
    });
  }

  // 🔹 수행 기관 (institution)
  if (filters.institution && filters.institution.length) {
    const selected = filters.institution;
    result = result.filter((p) => {
      const inst = p.institution || p.organization;
      if (!inst) return false;
      return selected.includes(inst) || selected.includes("기타") === false
        ? selected.includes(inst)
        : true;
    });
  }

  // 🔹 자금 유형 (loan_type)
  if (filters.loan_type && filters.loan_type.length) {
    const selected = filters.loan_type;
    result = result.filter((p) => {
      const lt = p.loan_type;
      if (!lt) return false;
      return selected.some((t) => lt.includes(t));
    });
  }

  // 🔹 총 사업비 구간 (budget_bucket)
  if (filters.budget_bucket && filters.budget_bucket.length) {
    const selected = filters.budget_bucket;
    result = result.filter((p) => {
      const raw = p.budget ?? p.total_amount;
      const budget = toNum(raw);
      if (budget === null) return false;

      return selected.some((label) => {
        if (label.startsWith("Small")) return budget < 10_000_000;
        if (label.startsWith("Medium"))
          return budget >= 10_000_000 && budget < 50_000_000;
        if (label.startsWith("Large")) return budget >= 50_000_000;
        return true;
      });
    });
  }

  // 🔹 공동재원 구간 (co_financing_bucket)
  if (filters.co_financing_bucket && filters.co_financing_bucket.length) {
    const selected = filters.co_financing_bucket;
    result = result.filter((p) => {
      const raw = p.co_financing ?? p.cofinancing;
      const num = raw === "" || raw === null || raw === undefined ? null : toNum(raw);

      return selected.some((label) => {
        if (label === "None / Unknown")
          return num === null;
        if (label.startsWith("Small"))
          return num !== null && num < 10_000_000;
        if (label.startsWith("Medium"))
          return num !== null && num >= 10_000_000 && num < 50_000_000;
        if (label.startsWith("Large"))
          return num !== null && num >= 50_000_000;
        return true;
      });
    });
  }

  // 🔹 운영 기간 구간 (duration_bucket)
  if (filters.duration_bucket && filters.duration_bucket.length) {
    const selected = filters.duration_bucket;
    result = result.filter((p) => {
      const raw = p.duration_days;
      const days = toNum(raw);
      if (days === null) return false;

      return selected.some((label) => {
        if (label === "1년 미만") return days < 365;
        if (label === "1 ~ 3년")
          return days >= 365 && days < 365 * 3;
        if (label === "3년 이상") return days >= 365 * 3;
        return true;
      });
    });
  }

  // 🔹 시작 연도 범위 (startYearFrom / startYearTo)
  if (filters.startYearFrom || filters.startYearTo) {
    const fromYear = toNum(filters.startYearFrom);
    const toYear = toNum(filters.startYearTo);

    result = result.filter((p) => {
      const dateStr = p.start_date || p.startDate;
      if (!dateStr) return false;
      const year = toNum(String(dateStr).slice(0, 4));
      if (year === null) return false;

      if (fromYear !== null && year < fromYear) return false;
      if (toYear !== null && year > toYear) return false;
      return true;
    });
  }

  // 🔹 총 사업비 직접 범위 (budgetMin / budgetMax)
  if (filters.budgetMin || filters.budgetMax) {
    const min = toNum(filters.budgetMin);
    const max = toNum(filters.budgetMax);

    result = result.filter((p) => {
      const raw = p.budget ?? p.total_amount;
      const budget = toNum(raw);
      if (budget === null) return false;

      if (min !== null && budget < min) return false;
      if (max !== null && budget > max) return false;
      return true;
    });
  }

  // 🔹 공동재원 직접 범위 (coFinancingMin / coFinancingMax)
  if (filters.coFinancingMin || filters.coFinancingMax) {
    const min = toNum(filters.coFinancingMin);
    const max = toNum(filters.coFinancingMax);

    result = result.filter((p) => {
      const raw = p.co_financing ?? p.cofinancing;
      const num = toNum(raw);
      if (num === null) return false;

      if (min !== null && num < min) return false;
      if (max !== null && num > max) return false;
      return true;
    });
  }

  // 🔹 운영 기간 직접 범위 (durationMin / durationMax)
  if (filters.durationMin || filters.durationMax) {
    const min = toNum(filters.durationMin);
    const max = toNum(filters.durationMax);

    result = result.filter((p) => {
      const days = toNum(p.duration_days);
      if (days === null) return false;

      if (min !== null && days < min) return false;
      if (max !== null && days > max) return false;
      return true;
    });
  }

  return result;
}
