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

// Matches what POST /api/doctor/register actually accepts. The previous type
// declared `field` and `category` and omitted specialization/experience/
// education, so it described an endpoint that does not exist.
export type DoctorRegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  specialization: string;
  experience: number;
  education: string[];
  dateOfBirth?: string;
  category?: string;
  clinic?: {
    name?: string;
    address?: string;
    consultationType?: string;
    consultationFee?: number;
  };
  documents?: {
    degrees?: string[];
    license?: string;
    idProof?: string;
  };
};

export const doctorRegister = async (payload: DoctorRegisterPayload) => {
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
