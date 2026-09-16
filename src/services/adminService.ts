import { API_ENDPOINTS } from "./config";
import { request } from "./http";
import type { Admin, Doctor, DoctorStatus } from "./types";

export type AdminLoginResponse = {
  message: string;
  token: string;
  admin: Admin;
};

export const loginAdmin = (credentials: { email: string; password: string }) =>
  request<AdminLoginResponse>(API_ENDPOINTS.admin.login, {
    method: "POST",
    body: credentials,
  });

export const getAdminProfile = () =>
  request<Admin>(API_ENDPOINTS.admin.me, { actor: "admin" });

/** Doctor applications. Pass a status to filter server-side. */
export const fetchDoctorRequests = (status?: DoctorStatus) => {
  const url = status
    ? `${API_ENDPOINTS.admin.doctors}?status=${status}`
    : API_ENDPOINTS.admin.doctors;
  return request<Doctor[]>(url, { actor: "admin" });
};

export const updateDoctorStatus = (
  doctorId: string,
  status: DoctorStatus,
  adminRemarks: string = ""
) =>
  request<{ message: string; doctor: Doctor }>(
    `${API_ENDPOINTS.admin.doctors}/${doctorId}/status`,
    { method: "PATCH", body: { status, adminRemarks }, actor: "admin" }
  );
