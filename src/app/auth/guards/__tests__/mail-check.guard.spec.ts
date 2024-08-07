import { TestBed } from "@angular/core/testing";
import { CanActivateFn, Router } from "@angular/router";

import { MailCheckGuard } from "../mail-check.guard";
import { SystemGeneric } from "@/app/libs/types";

describe("MailCheckGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => MailCheckGuard(...guardParameters));

    const mockRouter = {
        navigate: () => Promise.resolve(true),
        getCurrentNavigation: () => ({
            extras: {
                state: {},
            },
        }),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: mockRouter,
                },
            ],
        });
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should return false when there is no email in state", async () => {
        const router = {};
        mockRouter.getCurrentNavigation = () => ({
            extras: {
                state: {},
            },
        });
        const result = await executeGuard(
            {} as SystemGeneric,
            router as SystemGeneric,
        );
        expect(result).toBe(false);
    });

    it("should return true when there is email in state", async () => {
        const router = {};
        mockRouter.getCurrentNavigation = () => ({
            extras: {
                state: {
                    email: "tim@mail.com",
                },
            },
        });
        const result = await executeGuard(
            {} as SystemGeneric,
            router as SystemGeneric,
        );
        expect(result).toBe(true);
    });
});
