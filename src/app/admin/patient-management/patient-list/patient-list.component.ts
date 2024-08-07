import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    output,
} from "@angular/core";
import { type Patient } from "@types";
import { CrudTableComponent } from "@shared/tables/crud-table/crud-table.component";
import { HBConfirmableActions } from "@services";
import { toObservable } from "@angular/core/rxjs-interop";
import { Confirm } from "@utils";
import { CrudActions, Roles } from "@types";
import { UserManagementService } from "@services/api/user-management.service";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { injectMutation } from "@tanstack/angular-query-experimental";

const headers = [
    "Fullname",
    "Email address",
    "Gender",
    "Contact",
    "Address",
    "Status",
    "",
];

const keys = [
    "fullName",
    "email",
    "gender",
    "contact",
    "address",
    "status",
    "profilePicture",
] as (keyof Patient)[];

@Component({
    selector: "hbp-patient-list",
    standalone: true,
    imports: [CrudTableComponent, EmptyListComponent, ErrorHandlerComponent],
    templateUrl: "./patient-list.component.html",
    styleUrls: ["./patient-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent extends HBConfirmableActions {
    patients = input.required<Patient[]>();
    headers = headers;
    keys = keys;
    isLoading = model(false);
    error = input<string>();
    retry = output<void>();
    selectedPatient?: Patient;
    action: CrudActions = CrudActions.Delete;
    override modalLoading = toObservable(
        computed(
            () =>
                this.isLoading() ||
                this.deleteMutation.isPending() ||
                this.activateMutation.isPending() ||
                this.deactivateMutation.isPending(),
        ),
    );
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Patient,
    );

    activateMutation = injectMutation((client) => ({
        mutationFn: (patient: Patient) =>
            this.userManagementService.toggleStatus(patient, "active"),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-patients"],
            });
        },
    }));

    deactivateMutation = injectMutation((client) => ({
        mutationFn: (patient: Patient) =>
            this.userManagementService.toggleStatus(patient, "inactive"),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-patients"],
            });
        },
    }));

    deleteMutation = injectMutation((client) => ({
        mutationFn: (patient: Patient) =>
            this.userManagementService.deleteUser(patient),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-patients"],
            });
        },
    }));

    activatePatient() {
        if (!this.selectedPatient) return;
        this.activateMutation.mutate(this.selectedPatient);
    }

    @Confirm({
        title: "Deactivate Patient?",
    })
    deactivatePatient() {
        if (!this.selectedPatient) return;
        this.deactivateMutation.mutate(this.selectedPatient);
    }

    @Confirm({
        title: "Delete Patient?",
    })
    deletePatient() {
        if (!this.selectedPatient) return;
        this.deleteMutation.mutate(this.selectedPatient);
    }
}
