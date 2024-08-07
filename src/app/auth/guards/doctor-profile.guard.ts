import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";

export const DoctorProfileGuard: CanActivateFn = async () => {
    const router = inject(Router);
    const appointmentBookingService = inject(AppointmentBookingService);

    const doctor = appointmentBookingService.selectedDoctor();

    if (doctor) {
        return true;
    } else {
        await router.navigate(["/patient/home"]);
        return false;
    }
};
