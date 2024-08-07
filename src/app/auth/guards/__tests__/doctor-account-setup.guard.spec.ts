import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { doctorAccountSetupGuard } from "../doctor-account-setup.guard";

describe("doctorAccountSetupGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            doctorAccountSetupGuard(...guardParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });
});
