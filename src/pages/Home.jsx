// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { useState } from "react";
import { api } from "../lib/api";

export default function Home() {
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async (filters) => {
    setLoading(true);
    try {
      const params = buildQuery(filters);
      const res = await api.get("/projects", { params });
      setProjects(res.data?.projects || []);
    } catch (e) {
      console.error(e);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 flex gap-6">
      <section className="flex-1">
        <div className="h-[195px] rounded-lg border mb-6 flex items-center justify-center">
          <p className="text-gray-600 text-base">project introduction</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} title={p.title} subtitle={p.subtitle}
                           onClick={() => nav(`/projects/${p.id}`)} />
            ))}
            {!projects.length && <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>}
          </div>
        )}
      </section>

      <FilterSidebar onApply={fetchProjects} />
    </main>
  );
}

// 프론트 → 백엔드 쿼리 매핑 (백 스펙에 맞게 키만 바꿔)
function buildQuery(filters) {
  const params = {};
  const map = {
    "국가/지역": "countries",
    "자금형태": "funding_type",
    "총사업비": "budget",
    "공동재원": "cofinancing",
    "보조금":   "grant",
    "펀딩형태": "funding_mode",
    "시행연도": "year",
    "위험요소": "risk",
    "수혜자수": "beneficiaries",
  };
  for (const [section, arr] of Object.entries(filters || {})) {
    const key = map[section] || section;
    params[key] = Array.isArray(arr) ? arr.join(",") : String(arr);
  }
  return params;
}
