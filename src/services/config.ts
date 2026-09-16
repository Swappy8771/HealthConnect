const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  patient: {
    login: `${BASE_URL}/patient/login`,
    register: `${BASE_URL}/patient/register`,
    profile: `${BASE_URL}/patient/me`,
    healthform: `${BASE_URL}/patient/healthform`,
    doctorList  :   `${BASE_URL}/patient/doctors`,
  },
  doctor: {
    login: `${BASE_URL}/doctor/login`,
    register: `${BASE_URL}/doctor/register`,
  },
  admin: {
    login: `${BASE_URL}/admin/login`,
    doctors: `${BASE_URL}/admin/doctors`, // ✅ Add this line
  },
  
};
