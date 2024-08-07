import { HBApiService } from "@services";
import {
    ApiSuccess,
    Appointment,
    BookAppointmentDetails,
    Doctor,
} from "@types";
import { Injectable, signal } from "@angular/core";
import { catchError, lastValueFrom, map, tap } from "rxjs";
import {
    convertDateToIsoWithoutZ,
    createMultipartForm,
    removeFalsyValues,
} from "@utils";

@Injectable({
    providedIn: "root",
})
export class AppointmentBookingService extends HBApiService {
    selectedDoctor = signal<Doctor | undefined>(undefined);
    selectedDate = signal<Date | undefined>(undefined);

    getAvailableBookingTimes(
        callback?: (time: string) => void,
    ): Promise<string[]> {
        return lastValueFrom(
            this.http
                .get<{ bookingTimes: string[] }>(
                    `${this.baseUrl}/booking/available-times`,
                    {
                        params: {
                            date: convertDateToIsoWithoutZ(this.selectedDate()),
                            doctorId: this.selectedDoctor()?.id || "",
                        },
                        ...this.headers,
                    },
                )
                .pipe(
                    map((data) => data.bookingTimes),
                    tap((times) => callback?.(times[0])),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    bookAppointment(details: BookAppointmentDetails): Promise<ApiSuccess> {
        const formData = createMultipartForm({
            ...removeFalsyValues(details),
            doctorId: this.selectedDoctor()?.id,
        });

        return lastValueFrom(
            this.http
                .post<ApiSuccess>(`${this.baseUrl}/booking`, formData)
                .pipe(
                    tap(() =>
                        this.toastService.toast({
                            message: `Appointment request sent to ${this.selectedDoctor()?.fullName}`,
                            status: "success",
                        }),
                    ),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    getDoctorSchedule(endTime: string): Promise<Appointment[]> {
        return lastValueFrom(
            this.http
                .get<Appointment[]>(
                    `${this.baseUrl}/booking/${this.selectedDoctor()?.id}`,
                    {
                        params: {
                            endTime,
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    getAvailableDoctorsWithRelatedBooking(
        bookingId: string | number,
    ): Promise<Doctor[]> {
        return lastValueFrom(
            this.http
                .get<Doctor[]>(
                    `${this.baseUrl}/booking/${bookingId}/available-doctors`,
                    {
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }
}
