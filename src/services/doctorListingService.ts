// src/services/doctorListingService.ts

import { API_ENDPOINTS } from "./config";

const headers = {
  "Content-Type": "application/json",
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// ✅ Get list of available doctors
export const getDoctorListings = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_ENDPOINTS.patient.doctorList, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};
