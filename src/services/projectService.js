// src/services/projectService.js
import api from "./apiClient";

/**
 * Swagger 기반 ProjectDTO / ProjectResponse 구조
 *
 * ProjectDTO / ProjectResponse 내부:
 * {
 *   projectId: number,
 *   projectName: string,
 *   countryRegion: string,
 *   budget: number,
 *   status: "PLANNED" | "IN_PROGRESS" | "COMPLETED",
 *   link: string,
 *   startDate: string(date-time),
 *   endDate: string(date-time),
 *   durationDays: number,
 *   institution: string,
 *   site: string,
 *   themeArea: string,
 *   cofinancing: number,
 *   loanType: string,
 *   createdAt: string(date-time)
 * }
 */

// 백엔드 응답을 프론트에서 쓰기 편한 형태로 변환
function mapProject(dto) {
  if (!dto) return null;

  const statusMap = {
    PLANNED: "예정",
    IN_PROGRESS: "진행 중",
    COMPLETED: "완료",
  };

  const statusKo = statusMap[dto.status] || dto.status || "";

  return {
    // 기존 mock 데이터와 최대한 호환되도록 필드 맞춰줌
    id: dto.projectId,
    projectId: dto.projectId,
    title: dto.projectName,
    projectName: dto.projectName,

    description: dto.link || "",

    country_region: dto.countryRegion,
    countryRegion: dto.countryRegion,

    institution: dto.institution,
    site: dto.site,
    themeArea: dto.themeArea,

    budget: dto.budget,
    cofinancing: dto.cofinancing,
    loanType: dto.loanType,

    status: statusKo,      // 카드/필터에서 쓰는 한글 상태
    rawStatus: dto.status, // 원래 ENUM 값 보존

    startDate: dto.startDate,
    endDate: dto.endDate,
    durationDays: dto.durationDays,
    createdAt: dto.createdAt,

    // 현재 백엔드에는 ownerEmail 개념이 없으므로 null 처리
    ownerEmail: null,
  };
}

/**
 * GET /projects
 *  - Swagger 상으론 request(object)가 query에 필요한데,
 *    일단은 필터 없이 전체 조회를 시도하고,
 *    필요하면 params에 검색 조건을 실어보는 방식으로 사용 가능.
 */
export async function getAllProjects(search = {}) {
  const res = await api.get("/projects", {
    // 백엔드 구현에 따라 여기 구조를 조정해야 할 수 있음
    params: search,
  });

  const body = res.data || {};
  if (body.code !== 0) {
    throw new Error(body.message || "프로젝트 목록 조회 실패");
  }

  // data: { projects: [ ProjectDTO ] }
  const data = body.data || {};
  const list = data.projects || [];

  return list.map(mapProject).filter(Boolean);
}

/**
 * GET /projects/{id}
 */
export async function getProject(id) {
  const res = await api.get(`/projects/${id}`);
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "프로젝트 상세 조회 실패");
  }

  const data = body.data;
  return mapProject(data);
}

/**
 * POST /projects
 *  - payload는 백엔드 AddProjectRequest 형태로 맞춰서 전달해야 함
 *  - 지금은 서비스 함수만 만들어두고,
 *    실제 form → payload 매핑은 나중에 같이 맞추자.
 */
export async function createProject(payload) {
  const res = await api.post("/projects", payload);
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "프로젝트 생성 실패");
  }

  return mapProject(body.data);
}

/**
 * PUT /projects/{id}
 */
export async function updateProject(id, payload) {
  const res = await api.put(`/projects/${id}`, payload);
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "프로젝트 수정 실패");
  }

  return true;
}

/**
 * DELETE /projects/{id}
 */
export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "프로젝트 삭제 실패");
  }

  return true;
}
