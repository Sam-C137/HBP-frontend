import { ButtonComponent } from "@shared/button/button.component";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { HBForm } from "@services";
import { Appointment, AppointmentStatuses, Roles, User } from "@types";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
    output,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { popup } from "@animations";
import {
    AppointmentManagementService,
    ToggleAppointmentStatusPayload,
} from "@services/api/appointment-management.service";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { UserService } from "@services/state";

@Component({
    selector: "hbp-cancel-appointment-overlay",
    standalone: true,
    imports: [
        TextareaComponent,
        ReactiveFormsModule,
        ButtonComponent,
        SpinnerComponent,
    ],
    templateUrl: "./cancel-appointment-overlay.component.html",
    styleUrls: [
        "./cancel-appointment-overlay.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [popup],
})
export class CancelAppointmentOverlayComponent extends HBForm {
    open = model.required<boolean>();
    appointment = input<Appointment>();
    cancelSuccess = output<void>();
    user = inject(UserService).user as User;
    targetUser = input<User>(this.user);
    private appointmentManagementService = inject(AppointmentManagementService);

    protected cancelAppointmentMutation = injectMutation(() => ({
        mutationFn: (details: ToggleAppointmentStatusPayload) =>
            this.appointmentManagementService.toggleAppointmentStatus(
                details,
                this.targetUser().id,
            ),
        onSuccess: async () => {
            this.cancelSuccess.emit();
            this.close();
        },
    }));

    protected patientCancelMutation = injectMutation(() => ({
        mutationFn: (details: ToggleAppointmentStatusPayload) =>
            this.appointmentManagementService.patientToggle(
                details,
                this.user.id,
            ),
        onSuccess: async () => {
            this.cancelSuccess.emit();
            this.close();
        },
    }));

    override setupForm() {
        return this.fb.group({
            reason: ["", [Validators.required]],
        });
    }

    public submit() {
        if (this.form.valid) {
            if (this.targetUser().role === Roles.Doctor) {
                this.cancelAppointmentMutation.mutate({
                    bookingId: this.appointment()?.bookingId || "",
                    action: AppointmentStatuses.CANCELLED,
                    reason: this.form.value["reason"],
                });
            } else {
                this.patientCancelMutation.mutate({
                    bookingId: this.appointment()?.bookingId || "",
                    action: AppointmentStatuses.CANCELLED,
                    reason: this.form.value["reason"],
                });
            }
        }
    }

    public close() {
        this.open.set(false);
    }
}
