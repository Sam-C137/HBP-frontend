import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { UserService } from "@services/state";
import { Roles } from "@types";
import { ToastService } from "@shared/toast/toast.service";

export const doctorRoutesGuard: CanActivateFn = async () => {
    const user = inject(UserService).user;
    const router = inject(Router);
    const toast = inject(ToastService);

    if (!user) return router.navigate([""]);

    if (user.role === Roles.Doctor && !user.firstLogin) {
        return true;
    }

    if (user.role === Roles.Doctor && user.firstLogin) {
        toast.toast({
            message: "Please complete your profile setup to continue",
            status: "warning",
        });
        return router.navigate(["/doctor/profile"]);
    }

    return router.navigate([`${user.role}/home`]);
};
