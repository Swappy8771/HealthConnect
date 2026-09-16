import { API_ENDPOINTS } from "./config";
import { request } from "./http";
import type { HealthForm, PatientProfile } from "./types";

// ✅ Profile
export const getPatientProfile = () =>
  request<PatientProfile>(API_ENDPOINTS.patient.profile, { actor: "patient" });

export const updatePatientProfile = (data: Partial<PatientProfile>) =>
  request<PatientProfile>(API_ENDPOINTS.patient.profile, {
    method: "PUT",
    body: data,
    actor: "patient",
  });

export const deletePatientProfile = () =>
  request<{ message: string }>(API_ENDPOINTS.patient.profile, {
    method: "DELETE",
    actor: "patient",
  });

// 🩺 Health form
export const getHealthForm = () =>
  request<HealthForm>(API_ENDPOINTS.patient.healthform, { actor: "patient" });

export const updateHealthForm = (formData: HealthForm) =>
  request<HealthForm>(API_ENDPOINTS.patient.healthform, {
    method: "PUT",
    body: formData,
    actor: "patient",
  });
