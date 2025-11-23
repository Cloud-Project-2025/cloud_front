// src/pages/UserProjects.jsx (UserProjects와 AdminProjects 모두 비슷하게 수정)
import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import FilterSidebar from "../components/FilterSidebar";
import { api } from "../lib/api";

export default function UserProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async (filters) => {
    setLoading(true);
    try {
      const params = buildQuery(filters); // 필터를 쿼리로 변환
      const res = await api.get("/projects", { params }); // 프로젝트 API 요청
      setProjects(res.data.projects || []); // 프로젝트 데이터 상태 업데이트
    } catch (e) {
      console.error(e);
      setProjects([]); // 에러 시 빈 목록
    } finally {
      setLoading(false);
    }
  };

  // 필터가 적용될 때마다 프로젝트 다시 불러오기
  const handleApplyFilters = (filters) => {
    fetchProjects(filters);
  };

  // 필터 상태를 API 쿼리 파라미터로 변환
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

  return (
    <div className="flex gap-6 flex-row-reverse"> {/* 필터 사이드바를 오른쪽으로 배치 */}
      <FilterSidebar onApply={handleApplyFilters} />
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">My Projects</h2>
        {/* 로딩 중일 때 */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  subtitle={project.subtitle}
                  onClick={() => {}}
                />
              ))
            ) : (
              <p>No projects found.</p> // 프로젝트가 없을 때 메시지
            )}
          </div>
        )}
      </div>
    </div>
  );
}
