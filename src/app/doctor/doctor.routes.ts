import { Routes } from "@angular/router";
import { DoctorAuthComponent } from "@auth/doctor-auth/doctor-auth.component";
import { AccountEntryComponent } from "@shared/account-entry/account-entry.component";
import { doctorRoutesGuard } from "@auth/guards/doctor-routes.guard";
import { doctorAccountSetupGuard } from "@auth/guards/doctor-account-setup.guard";

export const doctorRoutes: Routes = [
    {
        path: "auth",
        component: DoctorAuthComponent,
        children: [
            {
                path: "sign-up",
                loadComponent: () =>
                    import("@auth/doctor-auth/sign-up/sign-up.component").then(
                        (m) => m.DoctorSignUpComponent,
                    ),
            },
        ],
        data: { animation: "isRight" },
    },
    {
        path: "",
        component: AccountEntryComponent,
        children: [
            {
                path: "",
                pathMatch: "full",
                redirectTo: "home",
            },
            {
                path: "home",
                loadComponent: () =>
                    import("./dashboard/dashboard.component").then(
                        (c) => c.DashboardComponent,
                    ),
            },
            {
                path: "messages",
                loadComponent: () =>
                    import("./messages/messages.component").then(
                        (c) => c.MessagesComponent,
                    ),
            },
            {
                path: "appointments",
                loadComponent: () =>
                    import(
                        "./appointments/doctor-appointments-page/doctor-appointments-page.component"
                    ).then((c) => c.DoctorAppointmentsPageComponent),
            },
            {
                path: "appointments/patient-profile/:id",
                loadComponent: () =>
                    import(
                        "./appointments/patient-profile-page/patient-profile-page.component"
                    ).then((c) => c.PatientProfilePageComponent),
            },
            {
                path: "schedule",
                loadComponent: () =>
                    import(
                        "./appointments/doctor-schedule-page/doctor-schedule-page.component"
                    ).then((c) => c.DoctorSchedulePageComponent),
            },
            {
                path: "reviews",
                loadComponent: () =>
                    import("./reviews/reviews.component").then(
                        (c) => c.ReviewsComponent,
                    ),
            },
        ],
        canActivateChild: [doctorRoutesGuard],
    },
    {
        path: "profile",
        component: AccountEntryComponent,
        children: [
            {
                path: "",
                loadComponent: () =>
                    import("./profile/doctor-profile.component").then(
                        (c) => c.DoctorProfileComponent,
                    ),
                children: [
                    {
                        path: "",
                        loadComponent: () =>
                            import(
                                "./profile/doctor-profile-general/doctor-profile-general.component"
                            ).then((c) => c.DoctorProfileGeneralComponent),
                        canActivate: [doctorAccountSetupGuard],
                    },
                    {
                        path: "notifications",
                        loadComponent: () =>
                            import(
                                "./profile/doctor-profile-notifications/doctor-profile-notifications.component"
                            ).then(
                                (c) => c.DoctorProfileNotificationsComponent,
                            ),
                        canActivate: [doctorRoutesGuard],
                    },

                    {
                        path: "change-password",
                        loadComponent: () =>
                            import(
                                "./profile/doctor-profile-change-password/doctor-profile-change-password.component"
                            ).then(
                                (c) =>
                                    c.DoctorProfileChangePasswordFormComponent,
                            ),
                        canActivate: [doctorRoutesGuard],
                    },
                ],
            },
        ],
    },
];
