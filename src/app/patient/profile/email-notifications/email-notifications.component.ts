import { ButtonComponent } from "@shared/button/button.component";
import { SingleCheckBoxComponent } from "@shared/inputs/single-check-box/single-check-box.component";
import { HBForm } from "@services";
import { Preferences } from "@types";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AccountManagementService } from "@services/api/account-management.service";
import {
    injectMutation,
    injectQuery,
} from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-email-notifications",
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, SingleCheckBoxComponent],
    templateUrl: "./email-notifications.component.html",
    styleUrls: [
        "./email-notifications.component.scss",
        "../profile-management.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailNotificationsComponent extends HBForm implements OnInit {
    #accountManager = inject(AccountManagementService);

    protected emailPreferencesQuery = injectQuery(() => ({
        queryKey: ["emailPreferences"],
        queryFn: () => this.#accountManager.getEmailPreferences(),
    }));

    protected savePreferencesMutation = injectMutation(() => ({
        mutationFn: (data: Preferences) =>
            this.#accountManager.saveEmailPreferences(data),
    }));

    emailPreferences = computed(() => this.#accountManager.getPreferences());

    override setupForm() {
        return this.fb.group<Preferences>(
            this.#accountManager.getPreferences(),
        );
    }

    constructor() {
        super();
        effect(() => {
            this.form.patchValue({ ...this.emailPreferences() });
        });
    }

    public saveNewPreferences() {
        this.savePreferencesMutation.mutate(this.form.value);
    }
}
