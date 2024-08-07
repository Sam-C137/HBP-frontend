import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { Doctor } from "@types";
import { ButtonComponent } from "@shared/button/button.component";
import { FooterComponent } from "@shared/footer/footer.component";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AppointmentBookingService } from "@/app/services/api/appointment-booking.service";
import { CommonModule, NgIf } from "@angular/common";
import { Title } from "@utils";
import { ProgressBarComponent } from "@shared/progress/progress-bar/progress-bar.component";
import { ReviewComponent } from "@shared/review/review.component";
import { ReviewsService } from "@services/api/review.service";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { SpinnerComponent } from "@/app/shared/loaders/spinner/spinner.component";

@Component({
    selector: "hbp-doctor-profile-page",
    standalone: true,
    templateUrl: "./doctor-profile-page.component.html",
    styleUrl: "./doctor-profile-page.component.scss",
    imports: [
        NavbarComponent,
        UserAvatarComponent,
        ButtonComponent,
        FooterComponent,
        RouterLink,
        RouterLinkActive,
        CommonModule,
        ProgressBarComponent,
        ReviewComponent,
        SpinnerComponent,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorProfilePageComponent {
    @Title
    readonly title = "Doctor Profile";
    public doctor?: Doctor;
    private appointmentBookingService = inject(AppointmentBookingService);
    protected Math = Math;
    private reviewsService = inject(ReviewsService);
    private router = inject(Router);
    public currentPage = signal(0);

    protected reviewsQuery = injectQuery(() => ({
        queryKey: ["reviews", this.doctor?.id, this.currentPage()],
        queryFn: () =>
            this.reviewsService.getReviews(this.doctor?.id, this.currentPage()),
    }));

    constructor() {
        const doctor = this.appointmentBookingService.selectedDoctor();
        if (doctor) {
            this.doctor = doctor;
        }
    }

    public calculatePercentage(numOfReviews: number, totalReviews: number) {
        const reviewPercent = (numOfReviews / totalReviews) * 100;
        return reviewPercent ? reviewPercent : 0;
    }

    public changePage(event: CustomEvent) {
        if (this.reviewsQuery.isPending() || this.reviewsQuery.isFetching()) {
            return;
        }
        this.currentPage.set(event.detail - 1);
    }

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
