// src/lib/api.js
import axios from "axios";
import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
