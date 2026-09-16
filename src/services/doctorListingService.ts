import { API_ENDPOINTS } from "./config";
import { request } from "./http";
import type { Doctor } from "./types";

/** Approved doctors, flat. */
export const getDoctorListings = () =>
  request<Doctor[]>(API_ENDPOINTS.patient.doctorList, { actor: "patient" });

/** The same set grouped by specialization, for a sectioned view. */
export const getDoctorsByCategory = () =>
  request<Record<string, Doctor[]>>(API_ENDPOINTS.patient.doctorsByCategory, {
    actor: "patient",
  });
