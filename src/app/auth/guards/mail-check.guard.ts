import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const MailCheckGuard: CanActivateFn = async () => {
    const router = inject(Router);
    const state = router.getCurrentNavigation()?.extras.state;

    if (state && state["email"]) {
        return true;
    } else {
        await router.navigate(["/auth/login"]);
        return false;
    }
};
