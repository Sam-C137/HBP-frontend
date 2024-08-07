import { HBForm } from "@services";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { popup } from "@animations";
import { TimePickerComponent } from "@shared/inputs/time-picker/time-picker.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { Appointment } from "@types";
import { AppointmentManagementService } from "@services/api/appointment-management.service";
import { FileAttachmentComponent } from "@shared/file-attachment/file-attachment.component";
import { NgIf } from "@angular/common";

@Component({
    selector: "hbp-appointment-details-overlay",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TextareaComponent,
        TimePickerComponent,
        InputComponent,
        FileAttachmentComponent,
        NgIf,
    ],
    templateUrl: "./appointment-details-overlay.component.html",
    styleUrls: [
        "./appointment-details-overlay.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [popup],
})
export class AppointmentDetailsOverlayComponent extends HBForm {
    open = model.required<boolean>();
    appointment = input.required<Appointment | undefined>();
    appointmentService = inject(AppointmentManagementService);

    override setupForm() {
        return this.fb.group({
            time: [
                {
                    value: this.appointment()?.appointmentTime || "",
                    disabled: true,
                },
            ],
            name: [
                {
                    value: this.appointment()?.relatedUser.fullName || "",
                    disabled: true,
                },
            ],
            reason: [
                {
                    value: this.appointment()?.description || "",
                    disabled: true,
                },
            ],
        });
    }

    close() {
        this.open.set(false);
    }
}
