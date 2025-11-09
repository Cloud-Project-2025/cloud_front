// src/services/authService.js
import { api } from "../lib/api";


export async function loginReq({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  const data = res.data || {};
  return { token: data.access_token || data.token, user: data.user };
}

export async function registerReq({ email, password }) {
  const res = await api.post("/auth/register", { email, password });
  const data = res.data || {};
  return { token: data.access_token || data.token || null, user: data.user || null };
}

export async function meReq() {
  const res = await api.get("/auth/me");
  return res.data;
}
