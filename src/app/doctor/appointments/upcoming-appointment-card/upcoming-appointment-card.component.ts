import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { ButtonComponent } from "@shared/button/button.component";
import { TimePipe } from "@pipes";
import { Appointment, Doctor } from "@types";
import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    signal,
} from "@angular/core";
import { RescheduleAppointmentOverlayComponent } from "@shared/modals/reschedule-appointment-overlay/reschedule-appointment-overlay.component";
import { CancelAppointmentOverlayComponent } from "@shared/modals/cancel-appointment-overlay/cancel-appointment-overlay.component";
import { FileAttachmentComponent } from "@shared/file-attachment/file-attachment.component";
import { injectQueryClient } from "@tanstack/angular-query-experimental";
import { UserService } from "@services/state";

@Component({
    selector: "hbp-upcoming-appointment-card",
    standalone: true,
    imports: [
        ButtonComponent,
        UserAvatarComponent,
        CommonModule,
        TimePipe,
        RescheduleAppointmentOverlayComponent,
        CancelAppointmentOverlayComponent,
        FileAttachmentComponent,
    ],
    templateUrl: "./upcoming-appointment-card.component.html",
    styleUrl: "./upcoming-appointment-card.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingAppointmentCardComponent {
    appointment = input.required<Appointment>();
    selectedAppointment = signal<Appointment | undefined>(undefined);
    user = inject(UserService).user as Doctor;
    isRescheduleOpen = false;
    isCancelOpen = false;
    private client = injectQueryClient();

    public async invalidateQueries() {
        await this.client.invalidateQueries({
            queryKey: ["doctor-appointments"],
        });
        await this.client.invalidateQueries({
            queryKey: ["doctor-upcoming-appointments"],
        });
    }
}
