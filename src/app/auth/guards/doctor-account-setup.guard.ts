import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { UserService } from "@services/state";
import { Roles } from "@types";

export const doctorAccountSetupGuard: CanActivateFn = () => {
    const user = inject(UserService).user;
    const router = inject(Router);

    if (!user) return router.navigate([""]);

    if (user.role === Roles.Doctor) return true;

    return router.navigate([`${user.role}/home`]);
};
