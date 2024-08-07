import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { patientRoutesGuard } from "../patient-routes.guard";

describe("patientRoutesGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            patientRoutesGuard(...guardParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });
});
