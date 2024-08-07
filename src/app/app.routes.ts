import { Routes } from "@angular/router";
import { patientRoutesGuard } from "@auth/guards/patient-routes.guard";
import { adminRoutesGuard } from "@auth/guards/admin-routes.guard";

export const routes: Routes = [
    {
        path: "",
        loadChildren: () =>
            import("./shared/shared.routes").then((m) => m.sharedRoutes),
    },
    {
        path: "doctor",
        loadChildren: () =>
            import("./doctor/doctor.routes").then((m) => m.doctorRoutes),
    },
    {
        path: "patient",
        loadChildren: () =>
            import("./patient/patient.routes").then((m) => m.patientRoutes),
        canActivate: [patientRoutesGuard],
    },
    {
        path: "admin",
        loadComponent: () =>
            import("./shared/account-entry/account-entry.component").then(
                (m) => m.AccountEntryComponent,
            ),
        loadChildren: () =>
            import("./admin/admin.routes").then((m) => m.adminRoutes),
        canActivate: [adminRoutesGuard],
    },
    {
        path: "**",
        loadComponent: () =>
            import("./shared/not-found-page/not-found-page.component").then(
                (m) => m.NotFoundPageComponent,
            ),
    },
];
