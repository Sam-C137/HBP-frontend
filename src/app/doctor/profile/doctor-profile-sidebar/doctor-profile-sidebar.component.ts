import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { HBConfirmableActions } from "@services";
import { toObservable } from "@angular/core/rxjs-interop";
import { Confirm } from "@utils";
import { AccountManagementService } from "@services/api/account-management.service";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-doctor-profile-sidebar",
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: "./doctor-profile-sidebar.component.html",
    styleUrl: "./doctor-profile-sidebar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorProfileSidebarComponent extends HBConfirmableActions {
    override modalLoading = toObservable(
        computed(() => this.accountDeletionMutation.isPending()),
    );
    private accountManager = inject(AccountManagementService);
    protected accountDeletionMutation = injectMutation(() => ({
        mutationFn: () => this.accountManager.deleteAccount(),
    }));

    @Confirm({
        title: "Delete Accont?",
    })
    public deleteAccount() {
        this.accountDeletionMutation.mutate();
    }
}
