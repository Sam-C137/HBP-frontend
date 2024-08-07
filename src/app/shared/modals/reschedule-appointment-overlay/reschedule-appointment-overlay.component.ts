import { ButtonComponent } from "@shared/button/button.component";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { Appointment, AppointmentStatuses, Doctor, Roles, User } from "@types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    model,
    OnInit,
    output,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { popup } from "@animations";
import { DatePickerComponent } from "@shared/inputs/date-picker/date-picker.component";
import { TimePickerComponent } from "@shared/inputs/time-picker/time-picker.component";
import { ClickOutsideDirective } from "@/app/libs/directives";
import { AppointmentBookingService } from "@/app/services/api/appointment-booking.service";
import { SpinnerComponent } from "@/app/shared/loaders/spinner/spinner.component";
import {
    injectMutation,
    injectQuery,
} from "@tanstack/angular-query-experimental";
import {
    AppointmentManagementService,
    ToggleAppointmentStatusPayload,
} from "@services/api/appointment-management.service";
import { FormValidator } from "@/app/utils";

@Component({
    selector: "hbp-reschedule-appointment-overlay",
    standalone: true,
    imports: [
        TextareaComponent,
        ButtonComponent,
        ReactiveFormsModule,
        DatePickerComponent,
        TimePickerComponent,
        ClickOutsideDirective,
        SpinnerComponent,
    ],
    templateUrl: "./reschedule-appointment-overlay.component.html",
    styleUrls: [
        "./reschedule-appointment-overlay.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [popup],
})
export class RescheduleAppointmentOverlayComponent implements OnInit {
    doctor = input<Doctor | undefined>(undefined);
    targetUser = input<User | undefined>(undefined);
    private cdr = inject(ChangeDetectorRef);
    appointment = input<Appointment>();
    protected today = new Date();
    open = model.required<boolean>();
    rescheduleSuccess = output<void>();
    private appointmentBookingService = inject(AppointmentBookingService);
    private appointmentManagementService = inject(AppointmentManagementService);
    protected form!: FormGroup;
    protected formValidator!: FormValidator;
    private formBuilder = inject(FormBuilder);

    ngOnInit() {
        this.appointmentBookingService.selectedDoctor.set(this.doctor());
        this.appointmentBookingService.selectedDate.set(new Date());
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        this.watchDateChange();
    }

    protected availableTimesQuery = injectQuery(() => ({
        queryKey: ["doctor-available-times", this.doctor()],
        queryFn: () =>
            this.appointmentBookingService.getAvailableBookingTimes(
                (date: string) => {
                    this.form.get("appointmentTime")?.setValue(date);
                    this.cdr.detectChanges();
                },
            ),
    }));

    protected rescheduleMutation = injectMutation(() => ({
        mutationFn: (details: ToggleAppointmentStatusPayload) =>
            this.appointmentManagementService.toggleAppointmentStatus(
                details,
                this.targetUser()?.id,
                this.targetUser()?.role,
            ),
        onSuccess: async () => {
            this.rescheduleSuccess.emit();
            this.open.set(false);
        },
    }));

    protected patientRescheduleMutation = injectMutation(() => ({
        mutationFn: (details: ToggleAppointmentStatusPayload) =>
            this.appointmentManagementService.patientToggle(
                details,
                this.targetUser()?.id,
                this.targetUser()?.role,
            ),
        onSuccess: async () => {
            this.rescheduleSuccess.emit();
            this.open.set(false);
        },
    }));

    private setupForm() {
        return this.formBuilder.group({
            appointmentDate: [
                this.appointment()?.appointmentTime || new Date().toISOString(),
                [Validators.required],
            ],
            appointmentTime: [
                this.appointment()?.appointmentTime || new Date().toISOString(),
                [Validators.required],
            ],
            reason: ["", [Validators.required]],
        });
    }

    private watchDateChange() {
        this.form.get("appointmentDate")?.valueChanges.subscribe((date) => {
            this.appointmentBookingService.selectedDate.set(date);
            this.availableTimesQuery.refetch();
        });
    }

    public submit() {
        if (this.form.valid) {
            const { appointmentTime, reason } = this.form.value;
            if (this.targetUser()?.role === Roles.Doctor) {
                this.rescheduleMutation.mutate({
                    bookingId: this.appointment()?.bookingId || "",
                    action: AppointmentStatuses.RESCHEDULED,
                    reason,
                    newAppointmentTime: appointmentTime,
                });
            } else {
                this.patientRescheduleMutation.mutate({
                    bookingId: this.appointment()?.bookingId || "",
                    action: AppointmentStatuses.RESCHEDULED,
                    reason,
                    newAppointmentTime: appointmentTime,
                });
            }
        }
    }

    close() {
        this.open.set(false);
    }
}
