import { Routes } from "@angular/router";
import { servicesListResolver } from "@app/libs/resolvers/services-list.resolver";
import { DoctorProfileGuard } from "../auth/guards/doctor-profile.guard";
import { bookingGuard } from "../auth/guards/booking.guard";

export const patientRoutes: Routes = [
    {
        path: "home",
        loadComponent: () =>
            import("./home/home-page/home-page.component").then(
                (m) => m.HomePageComponent,
            ),
        resolve: { services: servicesListResolver },
    },
    {
        path: "chat",
        loadComponent: () =>
            import("./chat/chat.component").then((m) => m.ChatComponent),
    },
    {
        path: "doctors",
        loadComponent: () =>
            import(
                "./doctor-details/doctor-filter-page/doctor-filter-page.component"
            ).then((m) => m.DoctorFilterPageComponent),
    },
    {
        path: "doctors/:name",
        loadComponent: () =>
            import(
                "./doctor-details/doctor-profile-page/doctor-profile-page.component"
            ).then((m) => m.DoctorProfilePageComponent),
        canActivate: [DoctorProfileGuard],
    },
    {
        path: "doctors/:name/book-appointment",
        loadComponent: () =>
            import(
                "./appointment-booking/book-appointment-page/book-appointment-page.component"
            ).then((m) => m.BookAppointmentPageComponent),
        canActivate: [bookingGuard],
    },
    {
        path: "doctors/:name/calendar",
        loadComponent: () =>
            import(
                "./appointment-booking/doctor-calendar-page/doctor-calendar-page.component"
            ).then((m) => m.DoctorCalendarPageComponent),
        canActivate: [bookingGuard],
    },
    {
        path: "appointments",
        loadComponent: () =>
            import(
                "./appointment-history/appointments-page/appointments-page.component"
            ).then((m) => m.AppointmentsPageComponent),
    },
    {
        path: "appointments",
        loadComponent: () =>
            import(
                "./appointment-history/appointments-page/appointments-page.component"
            ).then((m) => m.AppointmentsPageComponent),
    },
    {
        path: "calendar",
        loadComponent: () =>
            import(
                "./appointment-history/patient-schedule-page/patient-schedule-page.component"
            ).then((m) => m.PatientSchedulePageComponent),
    },
    {
        path: "profile",
        loadComponent: () =>
            import("./profile/profile.entry.component").then(
                (m) => m.PatientProfileEntryComponent,
            ),
        children: [
            {
                path: "",
                redirectTo: "general",
                pathMatch: "full",
            },
            {
                path: "general",
                loadComponent: () =>
                    import(
                        "./profile/general-page/general-page.component"
                    ).then((m) => m.GeneralPageComponent),
                data: { animation: "isLeft" },
            },
            {
                path: "change-password",
                loadComponent: () =>
                    import(
                        "./profile/change-password/change-password.component"
                    ).then((c) => c.ChangePasswordComponent),
            },
            {
                path: "notifications",
                loadComponent: () =>
                    import(
                        "./profile/email-notifications/email-notifications.component"
                    ).then((c) => c.EmailNotificationsComponent),
            },
            {
                path: "reviews",
                loadComponent: () =>
                    import(
                        "./profile/reviews-page/reviews-page.component"
                    ).then((c) => c.ReviewsPageComponent),
            },
        ],
    },
];
