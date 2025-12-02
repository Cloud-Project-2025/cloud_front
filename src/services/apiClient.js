// src/services/apiClient.js
import axios from "axios";
import { getToken } from "../lib/auth";

// 백엔드 기본 주소
// 필요하면 .env에 VITE_API_BASE_URL 넣어서 바꿀 수 있게 해둠
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://54.180.119.238:8080";

const api = axios.create({
  baseURL: BASE_URL,
});

// 매 요청마다 accessToken 있으면 Authorization 헤더에 붙여줌
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
