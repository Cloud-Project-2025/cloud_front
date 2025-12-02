// src/services/authService.js
import api from "./apiClient";

/**
 * Swagger 기준 응답 형태
 *
 * POST /account/signin, /account/signup
 * {
 *   "code": 0,
 *   "message": "string",
 *   "data": {
 *     "id": "string",
 *     "userId": "string",
 *     "roles": "ADMIN" | "USER",
 *     "accessToken": "string",
 *     "refreshToken": "string"
 *   }
 * }
 */

function mapUserFromResponse(data = {}) {
  return {
    id: data.id,
    userId: data.userId,
    // userId를 이메일로 본다고 가정 (Swagger에 email 별도 필드 없음)
    email: data.userId,
    roles: data.roles,
  };
}

// 로그인
export async function loginReq({ email, password }) {
  const res = await api.post("/account/signin", { email, password });
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "로그인에 실패했습니다.");
  }

  const data = body.data || {};
  const user = mapUserFromResponse(data);

  return {
    token: data.accessToken,
    refreshToken: data.refreshToken,
    user,
  };
}

// 회원가입
export async function registerReq({ email, password }) {
  const res = await api.post("/account/signup", { email, password });
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "회원가입에 실패했습니다.");
  }

  const data = body.data || {};
  const user = mapUserFromResponse(data);

  return {
    token: data.accessToken,
    refreshToken: data.refreshToken,
    user,
  };
}

// (어드민 화면용) 전체 유저 조회
// GET /account
export async function fetchUsers() {
  const res = await api.get("/account");
  const body = res.data || {};

  if (body.code !== 0) {
    throw new Error(body.message || "사용자 목록을 불러오지 못했습니다.");
  }

  // data: { users: [ { userId, createdAt } ] }
  const data = body.data || {};
  return data.users || [];
}
