import API from "./axios";

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (username, password) => API.post("/token/", { username, password }),
  refresh:        (refresh)           => API.post("/token/refresh/", { refresh }),
  register:       (data)              => API.post("/accounts/register/", data),
  me:             ()                  => API.get("/accounts/me/"),
  updateMe:       (data)              => API.patch("/accounts/me/", data),
  changePassword: (data)              => API.post("/accounts/me/change-password/", data),
};

// ── USERS (admin) ─────────────────────────────────────────────────────────────
export const usersAPI = {
  list:           (params)            => API.get("/accounts/users/", { params }),
  create:         (data)              => API.post("/accounts/users/", data),
  byRole:         (role)              => API.get("/accounts/users/by-role/", { params: { role } }),
  pendingClients: ()                  => API.get("/accounts/users/pending-clients/"),
  approve:        (id, data)          => API.patch(`/accounts/users/${id}/approve/`, data),
  changeRole:     (id, role)          => API.patch(`/accounts/users/${id}/role/`, { role }),
  delete:         (id)                => API.delete(`/accounts/users/${id}/`),
};

// ── CASES ─────────────────────────────────────────────────────────────────────
export const casesAPI = {
  list:            (params)           => API.get("/cases/", { params }),
  get:             (id)               => API.get(`/cases/${id}/`),
  create:          (data)             => API.post("/cases/", data),
  update:          (id, data)         => API.patch(`/cases/${id}/`, data),
  delete:          (id)               => API.delete(`/cases/${id}/`),
  dashboard:       ()                 => API.get("/cases/dashboard/"),

  hearingNotes:    (id)               => API.get(`/cases/${id}/hearing-notes/`),
  addHearingNote:  (id, data)         => API.post(`/cases/${id}/hearing-notes/`, data),

  comments:        (id)               => API.get(`/cases/${id}/comments/`),
  addComment:      (id, text)         => API.post(`/cases/${id}/comments/`, { text }),

  updateProgress:  (id, progress)     => API.patch(`/cases/${id}/progress/`, { progress }),
  toggleVisibility:(id)               => API.patch(`/cases/${id}/visibility/`),
};

// ── DOCUMENTS ─────────────────────────────────────────────────────────────────
export const docsAPI = {
  list:    (caseId)         => API.get("/documents/", { params: caseId ? { case: caseId } : {} }),
  upload:  (formData)       => API.post("/documents/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  delete:  (id)             => API.delete(`/documents/${id}/`),
  update:  (id, data)       => API.patch(`/documents/${id}/`, data),
};

// ── LOGS (admin) ──────────────────────────────────────────────────────────────
export const logsAPI = {
  list:  (params)           => API.get("/logs/", { params }),
};

// ── ERROR HELPER ──────────────────────────────────────────────────────────────
export function getErrorMessage(err) {
  if (!err.response) return "Network error — is the backend running?";
  const data = err.response.data;
  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  // DRF validation errors come as { field: [msg, ...] }
  const msgs = Object.entries(data)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
    .join(" | ");
  return msgs || "An unexpected error occurred.";
}
