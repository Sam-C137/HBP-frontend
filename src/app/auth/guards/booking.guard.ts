import { AppointmentBookingService } from "@/app/services/api/appointment-booking.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const bookingGuard: CanActivateFn = async () => {
    const appointmentBookingService = inject(AppointmentBookingService);
    const router = inject(Router);
    if (
        appointmentBookingService.selectedDoctor() &&
        appointmentBookingService.selectedDate()
    ) {
        return true;
    }
    await router.navigate(["/patient/home"]);
    return false;
};
