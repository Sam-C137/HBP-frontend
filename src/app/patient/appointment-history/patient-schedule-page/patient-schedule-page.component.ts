import { CalendarComponent } from "@shared/calendar/calendar.component";
import { DateBuilder, Title, convertDateToIsoWithoutZ } from "@utils";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AccountManagementService } from "@services/api/account-management.service";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Roles } from "@types";
import { RouterLink } from "@angular/router";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { NavbarComponent } from "@shared/navbar/navbar.component";

@Component({
    selector: "hbp-patient-schedule-page",
    standalone: true,
    imports: [
        CalendarComponent,
        RouterLink,
        SpinnerComponent,
        ErrorHandlerComponent,
        BreadcrumbComponent,
        NavbarComponent,
    ],
    templateUrl: "./patient-schedule-page.component.html",
    styleUrl: "./patient-schedule-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientSchedulePageComponent {
    @Title
    readonly title = "My Calendar";
    private account = inject(AccountManagementService);
    protected Roles = Roles;

    protected patientSchedule = injectQuery(() => ({
        queryKey: ["patient-schedule"],
        queryFn: () => {
            const endOfYear = DateBuilder.getEndOfYear(new Date());
            endOfYear.setHours(16, 0, 0, 0);
            return this.account.getMyCalendar(
                convertDateToIsoWithoutZ(endOfYear),
            );
        },
    }));
}
