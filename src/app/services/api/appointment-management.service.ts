import { Injectable } from "@angular/core";
import { HBApiService } from "@services";
import {
    ApiSuccess,
    Appointment,
    AppointmentHistory,
    AppointmentStatuses,
    PageableItems,
} from "@types";
import { catchError, lastValueFrom, tap } from "rxjs";

export type Filters = {
    search: string;
    status: AppointmentStatuses;
    page: number;
    size: number;
};

export type ToggleAppointmentStatusPayload = {
    bookingId: string | number;
    action: AppointmentStatuses;
    reason?: string;
    newAppointmentTime?: string;
};

type BasicPatientInfo = {
    patientProfilePicture: string;
    patientName: string;
    patientEmail: string;
    gender: string;
    contact: string;
    emergencyContact: string;
};

@Injectable({
    providedIn: "root",
})
export class AppointmentManagementService extends HBApiService {
    getAppointments(
        filters: Partial<Filters>,
        doctorId?: string,
    ): Promise<PageableItems<Appointment>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<Appointment>>(
                    `${this.baseUrl}/booking/${doctorId}/patients`,
                    {
                        params: {
                            ...filters,
                            size: 10,
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    toggleAppointmentStatus(
        details: ToggleAppointmentStatusPayload,
        userId?: string,
        userRole?: string,
    ): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/booking`,
                    {
                        ...details,
                        action: userRole
                            ? `${userRole?.toUpperCase()}_${details.action}`
                            : details.action,
                        userId,
                    },
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Appointment ${details.action.toLowerCase()} successfully`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    getPatientInfo(id: string): Promise<BasicPatientInfo> {
        return lastValueFrom(
            this.http
                .get<BasicPatientInfo>(
                    `${this.baseUrl}/users/${id}/basic-info`,
                    this.headers,
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    patientToggle(
        details: ToggleAppointmentStatusPayload,
        userId?: string,
        userRole?: string,
    ) {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/booking/patients-appointments`,
                    {
                        ...details,
                        action: userRole
                            ? `${userRole?.toUpperCase()}_${details.action}`
                            : details.action,
                        userId,
                    },
                    this.headers,
                )
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Appointment ${details.action.toLowerCase()} successfully`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    getPersonalAppointments(
        filters: Partial<
            Omit<Filters, "status"> & {
                state: "upcoming" | "past" | "pending";
            }
        >,
        patientId?: string,
    ): Promise<PageableItems<Appointment>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<Appointment>>(
                    `${this.baseUrl}/booking/patients-appointments`,
                    {
                        params: {
                            ...filters,
                            patientId: patientId || "",
                            size: 10,
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e))),
        );
    }

    getAppointmentHistory(
        patientId: string,
        params: {
            page: number;
            size?: number;
        },
    ): Promise<PageableItems<AppointmentHistory>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<AppointmentHistory>>(
                    `${this.baseUrl}/users/${patientId}/appointment-history`,
                    {
                        params: {
                            ...params,
                            size: 10,
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }
}
