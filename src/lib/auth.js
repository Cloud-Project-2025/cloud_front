// src/lib/auth.js
const KEY = "access_token";
export function setToken(token) { if (token) localStorage.setItem(KEY, token); }
export function getToken() { return localStorage.getItem(KEY); }
export function clearToken() { localStorage.removeItem(KEY); }
