import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
    },
    {
        path: "home",
        loadComponent: () =>
            import(
                "./dashboard/admin-dashboard-page/admin-dashboard-page.component"
            ).then((m) => m.AdminDashboardPageComponent),
    },
    {
        path: "services",
        loadComponent: () =>
            import(
                "./service-configuration/services-page/services-page.component"
            ).then((m) => m.ServicesPageComponent),
    },
    {
        path: "services/create",
        loadComponent: () =>
            import(
                "./service-configuration/add-service-page/add-service-page.component"
            ).then((m) => m.AddServicePageComponent),
        data: { animation: "isLeft" },
    },
    {
        path: "doctors",
        loadComponent: () =>
            import(
                "./doctor-management/doctors-page/doctors-page.component"
            ).then((m) => m.DoctorsPageComponent),
    },
    {
        path: "patients",
        loadComponent: () =>
            import(
                "./patient-management/patients-page/patients-page.component"
            ).then((m) => m.PatientsPageComponent),
    },
    {
        path: "faqs",
        loadComponent: () =>
            import("./faq-management/faqs-page/faqs-page.component").then(
                (m) => m.FaqsPageComponent,
            ),
    },
    {
        path: "faqs/create",
        loadComponent: () =>
            import("./faq-management/add-faq-page/add-faq-page.component").then(
                (m) => m.AddFaqPageComponent,
            ),
        data: { animation: "isLeft" },
    },
    {
        path: "analytics",
        loadComponent: () =>
            import("./reporting-insight/analytics/analytics.component").then(
                (c) => c.AnalyticsComponent,
            ),
    },
];
