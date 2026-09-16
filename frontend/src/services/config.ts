// Set VITE_API_BASE_URL in .env to point at a deployed backend.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export type Actor = "patient" | "doctor" | "admin";

/** Which localStorage key holds each actor's token. */
export const TOKEN_KEYS: Record<Actor, string> = {
  patient: "token",
  doctor: "doctorToken",
  admin: "adminToken",
};

export const API_ENDPOINTS = {
  patient: {
    login: `${BASE_URL}/patient/login`,
    register: `${BASE_URL}/patient/register`,
    profile: `${BASE_URL}/patient/me`,
    healthform: `${BASE_URL}/patient/healthform`,
    doctorList: `${BASE_URL}/patient/doctors`,
    doctorsByCategory: `${BASE_URL}/patient/doctors-by-category`,
    doctorSlots: (doctorId: string) => `${BASE_URL}/patient/doctors/${doctorId}/slots`,
    appointments: `${BASE_URL}/patient/appointments`,
  },
  doctor: {
    login: `${BASE_URL}/doctor/login`,
    register: `${BASE_URL}/doctor/register`,
    availability: `${BASE_URL}/doctor/availability`,
    appointments: `${BASE_URL}/doctor/appointments`,
  },
  admin: {
    login: `${BASE_URL}/admin/login`,
    me: `${BASE_URL}/admin/me`,
    doctors: `${BASE_URL}/admin/doctors`,
  },
};
