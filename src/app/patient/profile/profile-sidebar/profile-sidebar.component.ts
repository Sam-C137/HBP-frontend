import { HBConfirmableActions } from "@services";
import { UserService } from "@/app/services/state";
import { Confirm } from "@utils";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AccountManagementService } from "@services/api/account-management.service";
import {
    injectMutation,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-profile-sidebar",
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: "./profile-sidebar.component.html",
    styleUrl: "./profile-sidebar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebarComponent extends HBConfirmableActions {
    private user = inject(UserService).user!;
    queryClient = injectQueryClient();
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
        this.queryClient.invalidateQueries();
    }
}
