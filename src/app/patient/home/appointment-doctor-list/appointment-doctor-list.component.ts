import { Doctor } from "@types";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from "@angular/core";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";
import { ButtonComponent } from "@shared/button/button.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: "hbp-appointment-doctor-list",
    standalone: true,
    imports: [
        SpinnerComponent,
        ErrorHandlerComponent,
        EmptyListComponent,
        ButtonComponent,
        UserAvatarComponent,
        RouterLink,
    ],
    templateUrl: "./appointment-doctor-list.component.html",
    styleUrl: "./appointment-doctor-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentDoctorListComponent {
    doctors = input.required<Doctor[]>();
    loading = input<boolean>();
    error = input<string | undefined>(undefined);
    retry = output<void>();
    public appointmentBookingService = inject(AppointmentBookingService);
    protected Math = Math;
    private router = inject(Router);

    public async navigate(doctor: Doctor) {
        this.appointmentBookingService.selectedDoctor.set(doctor);
        await this.router.navigate(
            ["/patient/doctors", doctor.fullName, "book-appointment"],
            {
                queryParams: {
                    specialization: doctor.specialization,
                    date: this.appointmentBookingService
                        .selectedDate()
                        ?.toISOString(),
                },
            },
        );
    }
}
