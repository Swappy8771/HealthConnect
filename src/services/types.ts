// Shared API types. These mirror the backend schemas; previously each page
// declared its own `Doctor`, and no two agreed with each other or the schema.

export type Gender = "Male" | "Female" | "Other";
export type DoctorStatus = "pending" | "approved" | "rejected";

export type Clinic = {
  name?: string;
  address?: string;
  consultationType?: "Online" | "Offline" | "Both";
  consultationFee?: number;
};

export type DoctorDocuments = {
  degrees?: string[];
  license?: string;
  idProof?: string;
};

export type Doctor = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth?: string;
  education: string[];
  specialization: string;
  category?: string;
  experience: number;
  clinic?: Clinic;
  documents?: DoctorDocuments;
  status: DoctorStatus;
  adminRemarks?: string;
  reviewedBy?: { _id: string; name: string; email: string } | string | null;
  reviewedAt?: string | null;
  createdAt?: string;
};

export type PatientProfile = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender | "";
  dateOfBirth?: string;
  profileImage?: string;
  createdAt?: string;
};

export type HealthForm = {
  age?: number | string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medication?: string;
  chronicDiseases?: string;
  allergies?: string;
  surgeries?: string;
  smoking?: "Yes" | "No";
  alcohol?: "Yes" | "No";
  activityLevel?: "Low" | "Moderate" | "High";
  sleepHours?: number | string;
};

export type Admin = {
  _id: string;
  name: string;
  email: string;
  role: "super-admin" | "verification-admin" | "support-admin";
  status: "active" | "suspended";
};
