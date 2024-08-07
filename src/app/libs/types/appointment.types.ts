import type { Doctor, Patient, Service } from "@types";

export type Appointment = {
    relatedUser: Partial<Patient> | Partial<Doctor>;
    appointmentTime: string;
    appointmentStatus: AppointmentStatuses;
    description: string;
    bookingId: string | number;
    relatedService: Partial<Service>;
    medicalRecordUrl?: string;
};

export type BookAppointmentDetails = {
    description: string;
    medicaRecord: File | Blob | string;
    appointmentTime: string;
};

export type AppointmentHistory = {
    appointmentDate: string;
    doctorName: string;
    id: string | number;
    serviceColor: string;
};

export type AppointmentForDoctor = {
    patientProfileUrl: string;
    patientName: string;
    appointmentTime: string;
    appointmentType: AppointmentStatuses;
    medicalRecordUrl: string;
    description: string;
    id: string | number;
};

/**
 * @description
 * The actions that can be performed on an appointment.
 * CANCELLED: A cancelled appointment, can only be done when the appointment has been accepted by the
 * doctor. Can-activate: @type {Patient | Doctor}
 *
 * RESCHEDULED: A rescheduled appointment, can only be done when the appointment has been accepted by the
 * doctor. Can-activate: @type {Patient | Doctor}. @note Patient reschedules, that come after acceptance
 * should be approved by the doctor.
 *
 * VIEW_DETAILS: View the appointment details. Can-activate: @type {Patient | Doctor}
 *
 * VIEW_PROFILE: View the profile of the patient who booked an appointment.
 * Can-activate: @type {Patient | Doctor}
 *
 * ACCEPTED: An accepted appointment, action can only be done by the doctor. Can-activate: @type {Doctor}
 *
 * COMPLETED: A completed appointment, action can only be done by the doctor. Can-activate: @type {Doctor}
 *
 * REJECTED: A reject appointment, action can only be done by the doctor. Can-activate: @type {Doctor}
 *
 * @note The actions that can be performed on an appointment are dependent on the status of the appointment.
 *
 */

export enum AppointmentStatuses {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    RESCHEDULED = "RESCHEDULED",
    DOCTOR_RESCHEDULED = "DOCTOR_RESCHEDULED",
    PATIENT_RESCHEDULED = "PATIENT_RESCHEDULED",
    VIEW_DETAILS = "VIEW_DETAILS",
    VIEW_PROFILE = "VIEW_PROFILE",
    ACCEPTED = "ACCEPTED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
}
