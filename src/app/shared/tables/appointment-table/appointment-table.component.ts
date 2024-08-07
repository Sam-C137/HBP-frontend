import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    output,
} from "@angular/core";
import { Appointment, AppointmentStatuses } from "@types";
import { UserAvatarComponent } from "../../avatars/user-avatar/user-avatar.component";
import { DatePipe, TimePipe } from "@pipes";
import { SpinnerComponent } from "../../loaders/spinner/spinner.component";
import { AppointmentDetailsOverlayComponent } from "@shared/modals/appointment-details-overlay/appointment-details-overlay.component";
import { RouterLink } from "@angular/router";

const headers = ["Patient Name", "Appointment Date", "Time"];
const keys = [
    "relatedUser",
    "appointmentDate",
    "appointmentTime",
] as (keyof Appointment)[];

@Component({
    selector: "hbp-appointment-table",
    standalone: true,
    imports: [
        UserAvatarComponent,
        SpinnerComponent,
        DatePipe,
        TimePipe,
        AppointmentDetailsOverlayComponent,
        RouterLink,
    ],
    templateUrl: "./appointment-table.component.html",
    styleUrls: [
        "./appointment-table.component.scss",
        "../../../libs/stylesheets/tables.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentTableComponent {
    protected readonly AppointmentStatuses = AppointmentStatuses;
    headers = input<string[]>(headers);
    keys = input<(keyof Appointment)[]>(keys);
    loading = input<boolean>();
    isAppointmentDetailsOpen = false;

    selectedAppointment = model<Appointment>();

    items = input.required<
        (Appointment & {
            appointmentDate: string;
        })[],
        Appointment[]
    >({
        transform: (items) => {
            return items.map((item) => {
                return {
                    ...item,
                    appointmentDate: item.appointmentTime,
                };
            });
        },
    });

    actions = model<AppointmentStatuses | undefined>(undefined);

    accept = output<Appointment>();
    cancel = output<Appointment>();
    reschedule = output<Appointment>();
    reject = output<Appointment>();
    complete = output<Appointment>();
    viewDetails = output<Appointment>();
    viewProfile = output<Appointment>();
}
