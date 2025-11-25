// src/mock/mockData.js
// 프론트 전용 더미 데이터
// ------------------------------
// ✅ 실제 서비스
//   - 백엔드 DB (USERLIST, PROJECT 테이블 등)에서 가져옴
//   - API 예: /api/auth/users, /api/projects ...
//
// ✅ 더미 테스트 (현재 사용 중)
//   - 프론트에서만 사용하는 하드코딩 데이터
//   - 로그인/목록/상세/어드민 화면 전부 이걸 기준으로 동작

// 더미 유저 목록
// role: "admin" | "user"
export const mockUsers = [
  { id: 1, email: "admin@aaa.com", role: "admin" },
  { id: 2, email: "aaa@aaa.com", role: "user" },
  { id: 3, email: "bbb@bbb.com", role: "user" },
];

// 더미 프로젝트 목록
export const mockProjects = [
  {
    id: 101,
    title: "Afghanistan Climate Resilience Fund",
    description: "취약 지역 기후 회복력 강화를 위한 투자 프로젝트.",
    country_region: "Afghanistan",
    institution: "Green Climate Fund",
    status: "진행 중",
    ownerEmail: "aaa@aaa.com", // 작성자
  },
  {
    id: 102,
    title: "Bangladesh Coastal Protection Program",
    description: "해안 침식과 홍수 피해를 줄이기 위한 방재 인프라 구축.",
    country_region: "Bangladesh",
    institution: "World Bank",
    status: "진행 중",
    ownerEmail: "aaa@aaa.com",
  },
  {
    id: 103,
    title: "Brunei Renewable Energy Pilot",
    description: "재생에너지 도입을 위한 파일럿 프로젝트.",
    country_region: "Brunei Darussalam",
    institution: "GEF",
    status: "예정",
    ownerEmail: "bbb@bbb.com",
  },
  {
    id: 104,
    title: "Regional Climate Data Platform",
    description: "동남아시아 기후 데이터 통합 및 분석 플랫폼 구축.",
    country_region: "Hong Kong",
    institution: "UNDP",
    status: "완료",
    ownerEmail: "admin@aaa.com",
  },
  {
    id: 105,
    title: "Sahel Agroforestry Initiative",
    description: "사헬 지역 산림 복원 및 농업 생산성 향상 지원.",
    country_region: "Bhutan",
    institution: "IFAD",
    status: "진행 중",
    ownerEmail: "bbb@bbb.com",
  },
];
