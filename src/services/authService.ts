import { API_ENDPOINTS } from "./config";
import { request } from "./http";
import type { Doctor, Gender, PatientProfile } from "./types";

export type LoginCredentials = { email: string; password: string };

export type PatientLoginResponse = {
  message: string;
  token: string;
  patient: Pick<PatientProfile, "fullName" | "email" | "gender"> & { id: string };
};

export type DoctorLoginResponse = {
  message: string;
  token: string;
  doctor: { id: string; name: string; specialization: string };
};

// 🧑‍⚕️ Doctor
export const doctorLogin = (credentials: LoginCredentials) =>
  request<DoctorLoginResponse>(API_ENDPOINTS.doctor.login, {
    method: "POST",
    body: credentials,
  });

// Matches what POST /api/doctor/register accepts. The previous type declared
// `field` and `category` and omitted specialization/experience/education, so it
// described an endpoint that does not exist.
export type DoctorRegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender | "";
  password: string;
  specialization: string;
  experience: number;
  education: string[];
  dateOfBirth?: string;
  category?: string;
  clinic?: Doctor["clinic"];
  documents?: Doctor["documents"];
};

export const doctorRegister = (payload: DoctorRegisterPayload) =>
  request<{ message: string }>(API_ENDPOINTS.doctor.register, {
    method: "POST",
    body: payload,
  });

// 🧑‍🦱 Patient
export const patientLogin = (credentials: LoginCredentials) =>
  request<PatientLoginResponse>(API_ENDPOINTS.patient.login, {
    method: "POST",
    body: credentials,
  });

export type PatientRegisterPayload = {
  fullName: string;
  email: string;
  gender: Gender | "";
  password: string;
  phone: string;
  dateOfBirth?: string;
};

export const patientRegister = (payload: PatientRegisterPayload) =>
  request<{ message: string }>(API_ENDPOINTS.patient.register, {
    method: "POST",
    body: payload,
  });
