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

  // DB 스키마에 맞춰 확장된 더미 데이터 (유지)
  const dummyProjects = [
    {
      id: 1,
      title: "동남아시아 탄소 포집·저장 인프라 기금",
      description: "동남아시아 산업 지역의 대규모 탄소 포집 및 저장 인프라 개발을 위한 투자 펀드입니다.",
      country_region: "동남아시아 지역",
      institution: "Green Climate Fund",
      status: "진행 중",
    },
    {
      id: 2,
      title: "중앙아메리카 지역을 위한 기후 정보 서비스",
      description: "홍수, 가뭄 등 기후 위험에 대비하기 위한 지역별 조기 경보 및 기후 정보 서비스 역량 강화.",
      country_region: "중앙아메리카",
      institution: "Green Climate Fund",
      status: "진행 중",
    },
    {
      id: 3,
      title: "인도네시아 해양·연안 생물다양성의 지속가능한 관리",
      description: "인도네시아 해양 및 연안 생물 다양성 보전을 위한 지역 기반 관리 시스템 구축.",
      country_region: "인도네시아",
      institution: "Global Environment Facility",
      status: "진행 중",
    },
    {
      id: 7,
      title: "사모아 해안 자원 및 지역사회 기후변화 대응 회복력 강화",
      description: "취약한 해안 지역의 기후 변화 위험 관리 역량을 강화하고, 지역 사회 기반의 적응 활동 지원.",
      country_region: "사모아",
      institution: "UNDP",
      status: "완료",
    },
    {
      id: 6,
      title: "네팔 전력 부문 개혁과 지속가능한 수력발전 프로젝트",
      description: "네팔 전력 부문의 개혁과 지속 가능한 수력 발전 개발을 지원하여 기후변화에 대비하고 에너지 안보를 강화.",
      country_region: "네팔",
      institution: "WORLD BANK GROUP",
      status: "예정",
    },
  ];

  const fetchProjects = async (filters) => {
    setLoading(true);
    try {
      setProjects(dummyProjects); // 더미 데이터 설정
      // 실제 API 호출 시:
      // const params = buildQuery(filters);
      // const res = await api.get("/projects", { params });
      // setProjects(res.data?.projects || []);
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
          <div className="grid grid-cols-1 gap-4"> 
            {projects.map((p) => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onClick={() => nav(`/projects/${p.id}`)} 
              />
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
    "보조금":   "grant",
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