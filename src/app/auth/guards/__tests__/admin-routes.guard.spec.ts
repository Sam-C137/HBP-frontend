import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { adminRoutesGuard } from "../admin-routes.guard";

describe("adminRoutesGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            adminRoutesGuard(...guardParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });
});
