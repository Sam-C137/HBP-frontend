import { TimePipe } from "@pipes";
import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
} from "@angular/core";
import { popup } from "@animations";
import { UserAvatarComponent } from "../../avatars/user-avatar/user-avatar.component";
import { ButtonComponent } from "../../button/button.component";
import { Appointment, Doctor } from "@types";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";
import { Router } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { BarsComponent } from "@shared/loaders/bars/bars.component";

@Component({
    selector: "hbp-suggested-doctors-overlay",
    standalone: true,
    imports: [
        CommonModule,
        TimePipe,
        UserAvatarComponent,
        ButtonComponent,
        BarsComponent,
    ],
    templateUrl: "./suggested-doctors-overlay.component.html",
    styleUrls: [
        "./suggested-doctors-overlay.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [popup],
})
export class SuggestedDoctorsOverlayComponent {
    open = model.required<boolean>();
    appointment = input.required<Appointment>();
    private appointmentService = inject(AppointmentBookingService);
    private router = inject(Router);
    protected today = new Date();

    protected availableDoctorsQuery = injectQuery(() => ({
        queryKey: ["available-doctors", this.appointment().bookingId],
        queryFn: () =>
            this.appointmentService.getAvailableDoctorsWithRelatedBooking(
                this.appointment().bookingId,
            ),
    }));

    public async bookDoctor(doctor: Doctor) {
        this.appointmentService.selectedDate.set(this.today);
        this.appointmentService.selectedDoctor.set(doctor);
        await this.router.navigate(
            ["/patient/doctors", doctor.fullName, "book-appointment"],
            {
                queryParams: {
                    specialization: doctor.specialization,
                    date: this.appointmentService.selectedDate()?.toISOString(),
                },
            },
        );
    }

    close() {
        this.open.set(false);
    }
}
