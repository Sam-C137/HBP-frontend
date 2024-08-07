import { Doctor } from "@types";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from "@angular/core";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { Params, Router } from "@angular/router";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";
import { ButtonComponent } from "@shared/button/button.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";

@Component({
    selector: "hbp-filtered-doctor-list",
    standalone: true,
    imports: [
        SpinnerComponent,
        ErrorHandlerComponent,
        EmptyListComponent,
        ButtonComponent,
        UserAvatarComponent,
    ],
    templateUrl: "./filtered-doctor-list.component.html",
    styleUrl: "./filtered-doctor-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredDoctorListComponent {
    doctors = input.required<Doctor[]>();
    loading = input<boolean>();
    error = input<string>();
    retry = output<void>();
    queryParams = input.required<Params>();

    #router = inject(Router);
    private appointmentBookingService = inject(AppointmentBookingService);

    public async navigateTo(doctor: Doctor) {
        this.appointmentBookingService.selectedDoctor.set(doctor);
        await this.#router.navigate(
            ["/patient/doctors", doctor.fullName, "book-appointment"],
            { queryParams: this.queryParams() },
        );
    }
}
