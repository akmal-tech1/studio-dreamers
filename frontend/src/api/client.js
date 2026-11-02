const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const token = localStorage.getItem("sdp_token");
  if (token) {
    opts.headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE + path, opts);
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    const detail = data?.detail || `Request failed (${res.status})`;
    throw new ApiError(res.status, detail);
  }
  return data;
}

export const api = {
  films: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null))
    ).toString();
    return apiFetch("/api/films" + (qs ? `?${qs}` : ""));
  },
  filmCategories: () => apiFetch("/api/films/categories"),
  film: (id) => apiFetch(`/api/films/${id}`),
  team: () => apiFetch("/api/team"),
  stats: () => apiFetch("/api/stats"),
  products: () => apiFetch("/api/store/products"),
  checkout: (items) => apiFetch("/api/store/checkout", { method: "POST", body: { items } }),
  me: () => apiFetch("/api/auth/me"),
  login: (email, password) => apiFetch("/api/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) =>
    apiFetch("/api/auth/register", { method: "POST", body: { name, email, password } }),
};
