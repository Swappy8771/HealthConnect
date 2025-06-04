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

// 🧑‍⚕️ Doctor Auth
export const doctorLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(API_ENDPOINTS.doctor.login, {
    method: "POST",
    headers,
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const doctorRegister = async (payload: {
  fullName: string;
  email: string;
  gender: string;
  field: string;
  category: string;
  password: string;
  phone: string;
  dateOfBirth?: string;
}) => {
  const response = await fetch(API_ENDPOINTS.doctor.register, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// 🧑‍🦱 Patient Auth
export const patientLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(API_ENDPOINTS.patient.login, {
    method: "POST",
    headers,
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const patientRegister = async (payload: {
  fullName: string;
  email: string;
  gender: string;
  password: string;
  phone: string;
  dateOfBirth?: string;
}) => {
  const response = await fetch(API_ENDPOINTS.patient.register, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};
