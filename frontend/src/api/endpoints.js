import api from "./client";

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  seedAdmin: () => api.post("/auth/seed-admin")
};

export const charityApi = {
  list: () => api.get("/charities"),
  create: (payload) => api.post("/charities", payload),
  update: (id, payload) => api.patch(`/charities/${id}`, payload)
};

export const userApi = {
  me: () => api.get("/users/me"),
  scores: () => api.get("/users/scores"),
  addScore: (payload) => api.post("/users/scores", payload),
  updateSubscription: (payload) => api.patch("/users/subscription", payload),
  updateCharity: (payload) => api.patch("/users/charity", payload),
  uploadProof: (winnerId, formData) => api.post(`/users/winners/${winnerId}/proof`, formData)
};

export const drawApi = {
  list: () => api.get("/draws"),
  winners: () => api.get("/draws/winners"),
  create: (payload) => api.post("/draws", payload)
};

export const adminApi = {
  users: () => api.get("/admin/users"),
  updateSubscription: (id, payload) => api.patch(`/admin/users/${id}/subscription`, payload),
  updateWinnerStatus: (id, payload) => api.patch(`/admin/winners/${id}/status`, payload)
};
