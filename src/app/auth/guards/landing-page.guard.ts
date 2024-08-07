import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { UserService } from "@services/state";
import { Roles } from "@types";

export const landingPageGuard: CanActivateFn = () => {
    const user = inject(UserService).user;
    const router = inject(Router);

    if (!user) return true;

    if (user.role === Roles.Patient) return true;

    return router.navigate([`${user.role}/home`]);
};
