const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  patient: {
    login: `${BASE_URL}/patient/login`,
    register: `${BASE_URL}/patient/register`,
    profile: `${BASE_URL}/patient/me`, // ✅ Added this line
  },
  doctor: {
    login: `${BASE_URL}/doctor/login`,
    register: `${BASE_URL}/doctor/register`,
  },
};
