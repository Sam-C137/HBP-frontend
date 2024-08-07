import { Roles } from "@/app/libs/types";
import { convertDateToIsoWithoutZ, DateBuilder } from "@utils";
import { CalendarComponent } from "@shared/calendar/calendar.component";
import { UserService } from "@/app/services/state";
import { ErrorHandlerComponent } from "@/app/shared/error-handler/error-handler.component";
import { SpinnerComponent } from "@/app/shared/loaders/spinner/spinner.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { AccountManagementService } from "@services/api/account-management.service";

@Component({
    selector: "hbp-doctor-schedule-page",
    standalone: true,
    imports: [
        CalendarComponent,
        RouterLink,
        ErrorHandlerComponent,
        SpinnerComponent,
    ],
    templateUrl: "./doctor-schedule-page.component.html",
    styleUrl: "./doctor-schedule-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorSchedulePageComponent {
    private accountManagementService = inject(AccountManagementService);
    user = inject(UserService).user;
    protected Roles = Roles;

    protected scheduleQuery = injectQuery(() => ({
        queryKey: ["doctor-schedule"],
        queryFn: () => {
            const endOfYear = DateBuilder.getEndOfYear(new Date());
            endOfYear.setHours(16, 0, 0, 0);
            return this.accountManagementService.getMyCalendar(
                convertDateToIsoWithoutZ(endOfYear),
            );
        },
    }));
}
