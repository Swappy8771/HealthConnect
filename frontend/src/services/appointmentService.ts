import { API_ENDPOINTS } from "./config";
import { request } from "./http";
import type {
  Appointment,
  AppointmentStatus,
  AvailabilityWindow,
  DoctorAvailability,
  SlotsResponse,
} from "./types";

// ---- Patient ----

/** Open slots for one doctor on one date (YYYY-MM-DD). */
export const getDoctorSlots = (doctorId: string, date: string) =>
  request<SlotsResponse>(`${API_ENDPOINTS.patient.doctorSlots(doctorId)}?date=${date}`, {
    actor: "patient",
  });

export const bookAppointment = (payload: {
  doctorId: string;
  startsAt: string;
  consultationType?: "Online" | "Offline";
  reason?: string;
}) =>
  request<{ message: string; appointment: Appointment }>(
    API_ENDPOINTS.patient.appointments,
    { method: "POST", body: payload, actor: "patient" }
  );

export const getMyAppointments = (status?: AppointmentStatus) =>
  request<Appointment[]>(
    status
      ? `${API_ENDPOINTS.patient.appointments}?status=${status}`
      : API_ENDPOINTS.patient.appointments,
    { actor: "patient" }
  );

export const cancelMyAppointment = (id: string, reason?: string) =>
  request<{ message: string; appointment: Appointment }>(
    `${API_ENDPOINTS.patient.appointments}/${id}/cancel`,
    { method: "PATCH", body: { reason }, actor: "patient" }
  );

// ---- Doctor ----

export const getAvailability = () =>
  request<DoctorAvailability>(API_ENDPOINTS.doctor.availability, { actor: "doctor" });

export const saveAvailability = (payload: {
  availability: AvailabilityWindow[];
  slotMinutes: number;
}) =>
  request<DoctorAvailability>(API_ENDPOINTS.doctor.availability, {
    method: "PUT",
    body: payload,
    actor: "doctor",
  });

export const getDoctorAppointments = (params: { date?: string; status?: AppointmentStatus } = {}) => {
  const query = new URLSearchParams();
  if (params.date) query.set("date", params.date);
  if (params.status) query.set("status", params.status);
  const qs = query.toString();
  return request<Appointment[]>(
    qs ? `${API_ENDPOINTS.doctor.appointments}?${qs}` : API_ENDPOINTS.doctor.appointments,
    { actor: "doctor" }
  );
};

export const cancelDoctorAppointment = (id: string, reason?: string) =>
  request<{ message: string; appointment: Appointment }>(
    `${API_ENDPOINTS.doctor.appointments}/${id}/cancel`,
    { method: "PATCH", body: { reason }, actor: "doctor" }
  );
