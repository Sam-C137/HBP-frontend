import { CrudTableComponent } from "@shared/tables/crud-table/crud-table.component";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    output,
} from "@angular/core";
import { type Service } from "@types";
import { CrudActions } from "@types";
import { ServiceManagementService } from "@services/api/service-management.service";
import { HBConfirmableActions } from "@services";
import { toObservable } from "@angular/core/rxjs-interop";
import { Confirm } from "@utils";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { Router } from "@angular/router";
import { injectMutation } from "@tanstack/angular-query-experimental";

const headers = ["Service Name", "Number of Doctors", ""];

const keys = ["serviceName", "numberOfDoctors", "image"] as (keyof Service)[];

@Component({
    selector: "hbp-services-list",
    standalone: true,
    imports: [CrudTableComponent, EmptyListComponent, ErrorHandlerComponent],
    templateUrl: "./services-list.component.html",
    styleUrl: "./services-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesListComponent extends HBConfirmableActions {
    headers = headers;
    keys = keys;
    services = input.required<Service[]>();
    isLoading = model(false);
    error = input<string>();
    retry = output<void>();
    selectedService?: Service;
    actions = CrudActions.Deactivate;
    override modalLoading = toObservable(
        computed(
            () =>
                this.isLoading() ||
                this.archiveMutation.isPending() ||
                this.deleteMutation.isPending(),
        ),
    );
    private serviceManagement = inject(ServiceManagementService);
    private router = inject(Router);

    archiveMutation = injectMutation((client) => ({
        mutationFn: (service: Service) =>
            this.serviceManagement.toggleStatus(service, "inactive"),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["services"],
            });
            await client.invalidateQueries({
                queryKey: ["admin-services"],
            });
        },
    }));

    deleteMutation = injectMutation((client) => ({
        mutationFn: (service: Service) =>
            this.serviceManagement.deleteService(service),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["services"],
            });
            await client.invalidateQueries({
                queryKey: ["admin-services"],
            });
        },
    }));

    async editService() {
        await this.router.navigate(["/admin/services/create"], {
            state: { service: this.selectedService },
        });
    }

    @Confirm({
        title: "Archive service?",
    })
    archiveService() {
        if (!this.selectedService) return;
        this.archiveMutation.mutate(this.selectedService);
    }

    @Confirm({
        title: "Delete service?",
    })
    deleteService() {
        if (!this.selectedService) return;
        this.deleteMutation.mutate(this.selectedService);
    }
}
