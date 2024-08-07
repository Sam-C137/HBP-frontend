import { ButtonComponent } from "@/app/shared/button/button.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BookingTrendsChartComponent } from "./components/booking-trends-chart/booking-trends-chart.component";
import { DoctorAllocationsChartComponent } from "./components/doctor-allocations-chart/doctor-allocations-chart.component";
import { PatientFeedbackChartComponent } from "./components/patient-feedback-chart/patient-feedback-chart.component";
import { ExportReportComponent } from "./components/export-report/export-report.component";
import { ServiceManagementService } from "@/app/services/api/service-management.service";
import { injectQuery } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-analytics",
    standalone: true,
    imports: [
        ButtonComponent,
        BookingTrendsChartComponent,
        DoctorAllocationsChartComponent,
        PatientFeedbackChartComponent,
        ExportReportComponent,
    ],
    templateUrl: "./analytics.component.html",
    styleUrl: "./analytics.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
    #serviceManagement = inject(ServiceManagementService);
    servicesQuery = injectQuery(() => ({
        queryKey: ["landing-page-services"],
        queryFn: () => this.#serviceManagement.getAll({}),
    }));

    exportReport = false;

    openReportConfig() {
        this.exportReport = true;
    }
}
