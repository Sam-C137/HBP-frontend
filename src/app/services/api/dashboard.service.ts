import { inject, Injectable } from "@angular/core";
import { UserService } from "../state";
import { HttpClient } from "@angular/common/http";
import { HBApiService } from "../hb-api.service";
import { ChartData, Statistics } from "@/app/doctor/dashboard/dashboard.types";
import { catchError, lastValueFrom } from "rxjs";
import { convertDateToIsoWithoutZ } from "@/app/utils";
import { Appointment } from "@/app/libs/types";
import { AdminDashBoardData } from "@app/libs/types/dashboard.types";

@Injectable({
    providedIn: "root",
})
export class DashboardService extends HBApiService {
    #http = inject(HttpClient);
    userId = inject(UserService).user?.id;

    getAppointmentStats(doctorId: string): Promise<Statistics> {
        return lastValueFrom(
            this.#http
                .get<Statistics>(`${this.baseUrl}/booking/doctor-stats`, {
                    params: { doctorId },
                    ...this.headers,
                })
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    getUpcomingAppointments(
        doctorId: string,
        date: string,
    ): Promise<Appointment[]> {
        return lastValueFrom(
            this.#http
                .get<Appointment[]>(
                    `${this.baseUrl}/booking/daily-appointments`,
                    {
                        params: { doctorId, date },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    getChartStats(
        doctorId: string,
        isYearly: boolean,
        date: Date,
    ): Promise<ChartData> {
        const chartParams = {
            doctorId,
            isYearly,
            date: convertDateToIsoWithoutZ(date),
        };
        return lastValueFrom(
            this.#http.get<ChartData>(`${this.baseUrl}/booking/doctor-chart`, {
                params: chartParams,
                ...this.headers,
            }),
        );
    }

    getAdminDashBoardInfo(): Promise<AdminDashBoardData> {
        return lastValueFrom(
            this.#http
                .get<AdminDashBoardData>(
                    `${this.baseUrl}/admin-dashboard`,
                    this.headers,
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }
}
