// src/pages/ProjectDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 🔹 실제 서비스용 API (지금은 사용 X, 나중에 백엔드 연결 시 주석 해제)
// import { getProject } from "../services/projectService";
// 🔹 더미 테스트용 데이터
import { mockProjects } from "../mock/mockData.js";

// 날짜 안전하게 포맷 (없거나 이상하면 "N/A")
function formatDate(value) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toISOString().slice(0, 10); // 2024-01-01 형태
}

// 숫자 포맷 (없으면 "N/A")
function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString();
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setProject(null);

    // ================================
    // 🧩 실제 서비스용 (백엔드 연결 후 사용)
    // ================================
    // const fetchFromApi = async () => {
    //   try {
    //     const data = await getProject(id);  // 예: GET /api/projects/:id
    //     if (data) {
    //       setProject(data);
    //       return;
    //     }
    //   } catch (e) {
    //     console.error("getProject API 실패:", e);
    //     // 지금은 실패해도 mock으로 넘어감
    //   }
    // };

    // fetchFromApi();

    // ================================
    // ⭐ 현재: 더미 데이터로만 동작
    // ================================
    const dummy = mockProjects.find((p) => String(p.id) === String(id));
    if (!dummy) {
      setError("프로젝트 정보를 찾을 수 없습니다. (mock)");
      return;
    }
    setProject(dummy);
  }, [id]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  // 필드 이름 유연하게 매핑 (DB 구조 달라도 웬만하면 따라감)
  const title =
    project.project_name || project.name || project.title || "제목 없음";
  const description =
    project.project_description ||
    project.description ||
    "프로젝트 설명이 없습니다.";

  const projectId = project.project_id || project.projectId || project.id || "N/A";
  const countryRegion =
    project.country_region || project.countryRegion || project.region || "N/A";
  const totalBudget =
    project.total_budget ||
    project.totalBudget ||
    project.fundingAmount ||
    project.total_amount ||
    project.amount;

  const status = project.status || project.project_status || "N/A";
  const startDate =
    project.start_date || project.startDate || project.start || project.begin;
  const endDate =
    project.end_date || project.endDate || project.end || project.finish;

  const institution =
    project.institution ||
    project.implementing_agency ||
    project.agency ||
    "N/A";
  const topic = project.topic || project.theme || project.sector || "N/A";
  const coFinancing =
    project.co_financing ||
    project.coFinancing ||
    project.co_finance ||
    project.coFunding ||
    null;

  const carbonReduction =
    project.carbon_reduction || project.carbonReduction || null;
  const beneficiaries =
    project.beneficiaries || project.beneficiary || null;
  const risks = project.risks || project.risk_factors || project.risk || null;
  const projectType =
    project.project_type || project.type || project.fundingType || null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 상단 제목 영역 */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-1">상세정보</p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-xs text-gray-400 mt-1">id : {projectId}</p>
      </div>

      {/* Description 박스 */}
      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">Description</h2>
        <div className="border border-gray-300 rounded-md min-h-[160px] px-4 py-3 text-sm leading-relaxed">
          {description}
        </div>
      </section>

      {/* Project Data 섹션 */}
      <section>
        <h2 className="text-base font-semibold mb-2">Project Data</h2>
        <div className="border border-gray-300 rounded-md px-6 py-4 text-sm">
          <dl className="space-y-2">
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">프로젝트명</dt>
              <dd>{title}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">프로젝트 번호</dt>
              <dd>{projectId}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">나라 / 지역</dt>
              <dd>{countryRegion}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">총 사업비</dt>
              <dd>{formatNumber(totalBudget)}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">상태</dt>
              <dd>{status}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">시작일</dt>
              <dd>{formatDate(startDate)}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">종료일</dt>
              <dd>{formatDate(endDate)}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">기관</dt>
              <dd>{institution}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">주제</dt>
              <dd>{topic}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">공동 재정</dt>
              <dd>{coFinancing ? formatNumber(coFinancing) : "N/A"}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">Carbon reduction</dt>
              <dd>{carbonReduction ?? "N/A"}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">수혜자 수</dt>
              <dd>{beneficiaries ?? "N/A"}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">위험요소</dt>
              <dd>{risks ?? "N/A"}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 font-semibold">편입 타입</dt>
              <dd>{projectType ?? "N/A"}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
