import { NavbarComponent } from "@shared/navbar/navbar.component";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    viewChild,
} from "@angular/core";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ButtonComponent } from "@shared/button/button.component";
import { DatePickerComponent } from "@shared/inputs/date-picker/date-picker.component";
import { TimePickerComponent } from "@shared/inputs/time-picker/time-picker.component";
import {
    convertDateToIsoWithoutZ,
    FormValidator,
    validateFileSize,
    validateFileType,
} from "@/app/utils";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { AvailableTimesComponent } from "../available-times/available-times.component";
import { Title } from "@utils";
import { UserService } from "@services/state";
import { skip } from "rxjs";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { BookAppointmentDetails } from "@types";

@Component({
    selector: "hbp-book-appointment-page",
    standalone: true,
    imports: [
        NavbarComponent,
        RouterLink,
        RouterLinkActive,
        BreadcrumbComponent,
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        DatePickerComponent,
        TimePickerComponent,
        TextareaComponent,
        ButtonComponent,
        UserAvatarComponent,
        AvailableTimesComponent,
    ],
    templateUrl: "./book-appointment-page.component.html",
    styleUrl: "./book-appointment-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAppointmentPageComponent {
    protected queryParams: Record<string, string> = {};
    private activatedRoute = inject(ActivatedRoute);
    private appointmentBookingService = inject(AppointmentBookingService);
    protected doctor = this.appointmentBookingService.selectedDoctor();
    private user = inject(UserService).user;
    @Title
    readonly title = `Booking: ${this.doctor?.fullName}`;
    protected today = new Date().toISOString();
    protected form: FormGroup;
    protected formValidator: FormValidator;
    private formBuilder = inject(FormBuilder);

    private availableTimesComponent = viewChild.required(
        AvailableTimesComponent,
    );

    constructor() {
        this.getParams();
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        this.handleDateChange();
    }

    private setupForm() {
        return this.formBuilder.group({
            name: [
                { value: this.user?.fullName || "", disabled: true },
                [Validators.required],
            ],
            email: [
                {
                    value: this.user?.email || "",
                    disabled: true,
                },
                [Validators.required, Validators.email],
            ],
            appointmentDate: [this.selectedDate, [Validators.required]],
            appointmentTime: [new Date().toISOString(), [Validators.required]],
            description: ["", [Validators.maxLength(1000)]],
            medicalRecord: [
                "",
                [
                    validateFileType("raw", ["png", "jpg", "jpeg", "pdf"]),
                    validateFileSize("raw", 5000000),
                ],
            ],
        });
    }

    private handleDateChange() {
        this.form
            .get("appointmentDate")
            ?.valueChanges.pipe(skip(1))
            .subscribe((date) => {
                this.appointmentBookingService.selectedDate.set(new Date(date));
                this.availableTimesComponent().availableTimesQuery.refetch();
            });
    }

    get selectedDate() {
        return this.queryParams["date"]
            ? new Date(this.queryParams["date"])
            : new Date();
    }

    private getParams() {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.queryParams = params;
        });
    }

    public onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length) {
            const [file] = target.files;
            this.form.get("medicalRecord")?.setValue(file);
            this.form.get("medicalRecord")?.markAsTouched();
        }
    }

    protected bookAppointmentMutation = injectMutation((client) => ({
        mutationFn: (details: BookAppointmentDetails) =>
            this.appointmentBookingService.bookAppointment(details),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["availableTimes"],
            });
            this.form.get("medicalRecord")?.setValue("");
            this.form.get("description")?.setValue("");
        },
    }));

    public submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        /* eslint-disable prefer-const */
        let { appointmentTime, ...details } = this.form.value;
        appointmentTime = convertDateToIsoWithoutZ(new Date(appointmentTime));
        this.bookAppointmentMutation.mutate({
            ...details,
            appointmentTime,
        });
    }
}
