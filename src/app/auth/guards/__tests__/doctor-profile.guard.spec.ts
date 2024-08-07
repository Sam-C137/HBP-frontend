import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { DoctorProfileGuard } from "../doctor-profile.guard";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";
import { RouterTestingModule } from "@angular/router/testing";
import { SystemGeneric } from "@/app/libs/types";

describe("DoctorProfileGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            DoctorProfileGuard(...guardParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: AppointmentBookingService,
                    useValue: {
                        selectedDoctor: () => ({}),
                    },
                },
            ],
        });
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should return true when there is no selected doctor", async () => {
        const router = {
            navigate: () => Promise.resolve(true),
        };
        const result = await executeGuard(
            {} as SystemGeneric,
            router as SystemGeneric,
        );
        expect(result).toBe(true);
    });
});
