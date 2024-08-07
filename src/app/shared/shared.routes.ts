import { Routes } from "@angular/router";
import { UserAuthComponent } from "@auth/user-auth/user-auth.component";
import { landingPageGuard } from "@auth/guards/landing-page.guard";

export const sharedRoutes: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./landing-page/landing-page.component").then(
                (m) => m.LandingPageComponent,
            ),
        canActivate: [landingPageGuard],
    },
    {
        path: "auth",
        component: UserAuthComponent,
        children: [
            {
                path: "login",
                loadComponent: () =>
                    import("@auth/user-auth/login/login.component").then(
                        (m) => m.LoginComponent,
                    ),
            },
            {
                path: "sign-up",
                loadComponent: () =>
                    import("@auth/user-auth/sign-up/sign-up.component").then(
                        (m) => m.SignUpComponent,
                    ),
            },
            {
                path: "forgot-password",
                loadComponent: () =>
                    import(
                        "@auth/user-auth/forgot-password/forgot-password.component"
                    ).then((m) => m.ForgotPasswordComponent),
            },
            {
                path: "verify",
                loadComponent: () =>
                    import(
                        "@auth/user-auth/verify-otp/verify-otp.component"
                    ).then((m) => m.VerifyOtpComponent),
            },
            {
                path: "password-reset/:otp/:id/:email",
                loadComponent: () =>
                    import(
                        "@auth/user-auth/password-reset/password-reset.component"
                    ).then((m) => m.PasswordResetComponent),
            },
        ],
        data: { animation: "isLeft" },
    },
    {
        path: "notifications",
        loadComponent: () =>
            import("./notifications-page/notifications-page.component").then(
                (m) => m.NotificationsPageComponent,
            ),
    },
    {
        path: "services",
        loadComponent: () =>
            import("./services-page/services-page.component").then(
                (m) => m.ServicesPageComponent,
            ),
    },
    {
        path: "about",
        loadComponent: () =>
            import("./about-page/about-page.component").then(
                (m) => m.AboutPageComponent,
            ),
    },
];
