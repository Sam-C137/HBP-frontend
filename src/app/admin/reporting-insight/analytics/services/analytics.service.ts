import { HBApiService } from "@/app/services";
import { Injectable } from "@angular/core";
import { lastValueFrom, tap } from "rxjs";
import {
    BookingTrends,
    PatientFeedback,
    ReportPayload,
} from "../models/analytics.types";

@Injectable({
    providedIn: "root",
})
export class AnalyticsService extends HBApiService {
    getBookingTrends(payload: BookingTrends) {
        if (payload.metric === "This Week") {
            payload.metric = "WEEKLY";
        }
        return lastValueFrom(
            this.http.get<Record<string, number[]>>(
                `${this.baseUrl}/analytics/booking-trends`,
                { ...this.headers, params: payload },
            ),
        );
    }

    getDoctorAllocations() {
        return lastValueFrom(
            this.http.get<Record<string, number>>(
                `${this.baseUrl}/analytics/doctor-allocations`,
                { ...this.headers },
            ),
        );
    }

    getPatientFeedback() {
        return lastValueFrom(
            this.http.get<PatientFeedback>(
                `${this.baseUrl}/analytics/patient-feedback`,
                { ...this.headers },
            ),
        );
    }

    downloadReport(payload: ReportPayload) {
        return lastValueFrom(
            this.http
                .post(`${this.baseUrl}/reports`, payload, {
                    ...this.headers,
                    responseType: "blob",
                })
                .pipe(
                    tap((event) => {
                        const blob = new Blob([event], { type: "text/csv" });
                        const downloadURL = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = downloadURL;
                        const filename = "Report";
                        link.download = String(filename);
                        link.click();
                    }),
                ),
        );
    }
}
