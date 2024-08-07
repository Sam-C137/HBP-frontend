import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    output,
} from "@angular/core";
import { HBConfirmableActions } from "@services";
import { Confirm } from "@utils";
import { toObservable } from "@angular/core/rxjs-interop";
import { CrudTableComponent } from "@shared/tables/crud-table/crud-table.component";
import { CrudActions, type Doctor, Roles } from "@types";
import { UserManagementService } from "@services/api/user-management.service";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { injectMutation } from "@tanstack/angular-query-experimental";

const headers = [
    "Fullname",
    "Email address",
    "Specialization",
    "Level/Rank",
    "Status",
    "",
];

const keys = [
    "fullName",
    "email",
    "specialization",
    "rank",
    "status",
    "profilePicture",
] as (keyof Doctor)[];

@Component({
    selector: "hbp-doctor-list",
    standalone: true,
    imports: [CrudTableComponent, EmptyListComponent, ErrorHandlerComponent],
    templateUrl: "./doctor-list.component.html",
    styleUrl: "./doctor-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorListComponent extends HBConfirmableActions {
    doctors = input.required<Doctor[]>();
    isLoading = model<boolean>(false);
    error = input<string>();
    retry = output<void>();
    selectedDoctor?: Doctor;
    override modalLoading = toObservable(
        computed(
            () =>
                this.isLoading() ||
                this.activateMutation.isPending() ||
                this.deactivateMutation.isPending() ||
                this.deleteMutation.isPending(),
        ),
    );
    actions: CrudActions = CrudActions.Deactivate;
    headers = headers;
    keys = keys;
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Doctor,
    );

    activateMutation = injectMutation((client) => ({
        mutationFn: (doctor: Doctor) =>
            this.userManagementService.toggleStatus(doctor, "active"),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-doctors"],
            });
        },
    }));

    deactivateMutation = injectMutation((client) => ({
        mutationFn: (doctor: Doctor) =>
            this.userManagementService.toggleStatus(doctor, "inactive"),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-doctors"],
            });
        },
    }));

    deleteMutation = injectMutation((client) => ({
        mutationFn: (doctor: Doctor) =>
            this.userManagementService.deleteUser(doctor),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-doctors"],
            });
        },
    }));

    activateDoctor() {
        if (!this.selectedDoctor) return;
        this.activateMutation.mutate(this.selectedDoctor);
    }

    @Confirm({
        title: "Deactivate Doctor?",
    })
    deactivateDoctor() {
        if (!this.selectedDoctor) return;
        this.deactivateMutation.mutate(this.selectedDoctor);
    }

    @Confirm({
        title: "Delete Doctor?",
    })
    deleteDoctor() {
        if (!this.selectedDoctor) return;
        this.deleteMutation.mutate(this.selectedDoctor);
    }
}
