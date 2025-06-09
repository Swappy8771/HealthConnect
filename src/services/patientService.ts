// src/services/patientProfileService.ts

import { API_ENDPOINTS } from "./config";

const headers = {
  "Content-Type": "application/json",
};

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// ✅ Get patient profile
export const getPatientProfile = async () => {
  const token = getToken();
  const response = await fetch(API_ENDPOINTS.patient.profile, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// ✏️ Update patient profile
export const updatePatientProfile = async (data: any) => {
  const token = getToken();
  const response = await fetch(API_ENDPOINTS.patient.profile, {
    method: "PUT",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// ❌ Delete patient profile
export const deletePatientProfile = async () => {
  const token = getToken();
  const response = await fetch(API_ENDPOINTS.patient.profile, {
    method: "DELETE",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
