const rawBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const normalizedBase = rawBase.replace(/\/$/, "");

export const API_BASE_URL = normalizedBase.endsWith("/api")
  ? normalizedBase.slice(0, -4)
  : normalizedBase;

export const API_ROOT = `${API_BASE_URL}/api`;
