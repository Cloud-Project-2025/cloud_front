import { api } from "../lib/api";

export async function getProject(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

export async function createProject(payload) {
  const res = await api.post("/projects", payload);
  return res.data;
}

export async function updateProject(id, payload) {
  const res = await api.put(`/projects/${id}`, payload);
  return res.data;
}
