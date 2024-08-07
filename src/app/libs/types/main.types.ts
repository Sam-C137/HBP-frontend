import { WritableSignal } from "@angular/core";

export type User = {
    id: string;
    fullName: string;
    email: string;
    role: Roles;
    profilePicture: string | null;
    gender?: string;
    contact?: string;
    address?: string;
    status: "ACTIVE" | "INACTIVE";
    readonly firstLogin: boolean;
    readonly isVerified: boolean;
    emergencyName: string;
    emergencyRelationship: string;
    emergencyEmail: string;
    emergencyPhoneNumber: string;
    emergencyLocation: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SystemGeneric = Record<string, never> & any;

export type ApiSignal<T, U = SystemGeneric> = {
    loading: boolean;
    error: U | null;
    data: T | null;
};

export type NonNullablePartial<T> = {
    [P in keyof T]?: Exclude<T[P], null | undefined>;
};

export type ApiSignalState<T = SystemGeneric, U = ApiError> = WritableSignal<
    ApiSignal<T, U>
>;

export enum Roles {
    Doctor = "doctor",
    Patient = "patient",
    Admin = "admin",
}

export const ServerRoleToLocalRole: { [key: string]: Roles } = {
    DOCTOR: Roles.Doctor,
    PATIENT: Roles.Patient,
    ADMIN: Roles.Admin,
};

export type ApiError = {
    message: string;
    status: number;
};

export type ApiSuccess = NonNullable<unknown> & ApiError;

export enum CrudActions {
    Activate = "activate",
    Deactivate = "deactivate",
    Delete = "delete",
    Edit = "edit",
    Archive = "archive",
}

export type PageableItems<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    last: boolean;
    first: boolean;
    empty: boolean;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
};

export type Preferences = {
    appointmentBooked?: boolean | null;
    appointmentAccepted?: boolean | null;
    appointmentRescheduled: boolean | null;
    appointmentCancelled: boolean | null;
    appointmentCompleted?: boolean | null;
    accountDeactivated: boolean | null;
    appointmentRequested?: boolean | null;
    appointmentRejected?: boolean | null;
    accountInfoUpdated?: boolean | null;
};
