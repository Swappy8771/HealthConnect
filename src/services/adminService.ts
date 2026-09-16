import { API_ENDPOINTS } from "./config";

// ✅ Admin Login
export const loginAdmin = async (credentials: { email: string; password: string }) => {
  const response = await fetch(API_ENDPOINTS.admin.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to login");
  }

  return await response.json(); // Should include token and admin info
};

// ✅ Fetch All Doctor Requests (Pending/All based on endpoint used)
export const fetchDoctorRequests = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("Admin token missing");

  const response = await fetch(API_ENDPOINTS.admin.doctors, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctor requests");
  }

  return await response.json();
};

// ✅ Approve/Reject Doctor Status
export const updateDoctorStatus = async (
  doctorId: string,
  status: "approved" | "rejected",
  adminRemarks: string = ""
) => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("Admin token missing");

  const response = await fetch(`${API_ENDPOINTS.admin.doctors}/${doctorId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ status, adminRemarks }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update doctor status");
  }

  return await response.json();
};
