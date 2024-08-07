import { lighten, Title } from "@utils";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
import { ButtonComponent } from "@shared/button/button.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TimePipe } from "@/app/libs/pipes/time.pipe";
import { NavbarComponent } from "@/app/shared/navbar/navbar.component";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { AppointmentManagementService } from "@services/api/appointment-management.service";
import {
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";
import { UserService } from "@services/state";
import { Appointment, AppointmentStatuses } from "@types";
import { BarsComponent } from "@shared/loaders/bars/bars.component";
import { RescheduleAppointmentOverlayComponent } from "@shared/modals/reschedule-appointment-overlay/reschedule-appointment-overlay.component";
import { CancelAppointmentOverlayComponent } from "@shared/modals/cancel-appointment-overlay/cancel-appointment-overlay.component";
import { SuggestedDoctorsOverlayComponent } from "@shared/modals/suggested-doctors-overlay/suggested-doctors-overlay.component";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";

@Component({
    selector: "hbp-appointments-page",
    standalone: true,
    imports: [
        NavbarComponent,
        ButtonComponent,
        RouterLink,
        CommonModule,
        TimePipe,
        BreadcrumbComponent,
        BarsComponent,
        RescheduleAppointmentOverlayComponent,
        CancelAppointmentOverlayComponent,
        SuggestedDoctorsOverlayComponent,
        EmptyListComponent,
    ],
    templateUrl: "./appointments-page.component.html",
    styleUrl: "./appointments-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsPageComponent {
    @Title
    readonly title = "Appointment History";
    protected AppointmentStatuses = AppointmentStatuses;
    protected toggle = signal<"upcoming" | "past" | "pending">("pending");
    private appointmentManagementService = inject(AppointmentManagementService);
    protected user = inject(UserService).user;
    private client = injectQueryClient();
    public selectedAppointment = signal<Appointment | undefined>(undefined);
    public isRescheduleOpen = false;
    public isCancelOpen = false;
    public isSuggestedOpen = false;
    protected lighten = lighten;

    protected appointmentsQuery = injectQuery(() => ({
        queryKey: ["patient-appointment-history", this.toggle()],
        queryFn: () =>
            this.appointmentManagementService.getPersonalAppointments(
                {
                    state: this.toggle(),
                },
                this.user?.id,
            ),
        retry: 1,
    }));

    public async invalidateQueries() {
        await this.client.invalidateQueries({
            queryKey: ["patient-appointment-history"],
        });
    }
}
