import { NavbarComponent } from "@shared/navbar/navbar.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { AppointmentBookingService } from "@/app/services/api/appointment-booking.service";
import { Roles } from "@types";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { convertDateToIsoWithoutZ, DateBuilder } from "@utils";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { CalendarComponent } from "@/app/shared/calendar/calendar.component";
import { ActivatedRoute } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-doctor-calendar-page",
    standalone: true,
    imports: [
        NavbarComponent,
        BreadcrumbComponent,
        SpinnerComponent,
        ErrorHandlerComponent,
        CalendarComponent,
    ],
    templateUrl: "./doctor-calendar-page.component.html",
    styleUrl: "./doctor-calendar-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorCalendarPageComponent {
    private appointmentBookingService = inject(AppointmentBookingService);
    public doctor = this.appointmentBookingService.selectedDoctor();
    public queryParams = {};
    private activatedRoute = inject(ActivatedRoute);
    protected Roles = Roles;

    constructor() {
        this.getParams();
    }

    private getParams() {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.queryParams = params;
        });
    }

    protected doctorScheduleQuery = injectQuery(() => ({
        queryKey: ["appointment-doctor-schedule"],
        queryFn: () => {
            const endOfYear = DateBuilder.getEndOfYear(new Date());
            endOfYear.setHours(16, 0, 0, 0);
            return this.appointmentBookingService.getDoctorSchedule(
                convertDateToIsoWithoutZ(endOfYear),
            );
        },
    }));
}
