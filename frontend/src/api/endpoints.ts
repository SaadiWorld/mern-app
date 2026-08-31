const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5001/api/v1";

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  places: `${API_BASE_URL}/places`,
  auth: {
    signup: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/sessions`,
  },
} as const;
