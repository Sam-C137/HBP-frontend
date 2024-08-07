import { ButtonComponent } from "@/app/shared/button/button.component";
import { SingleCheckBoxComponent } from "@/app/shared/inputs/single-check-box/single-check-box.component";
import { HBForm } from "@services";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
} from "@angular/core";
import { Preferences } from "@types";

import { ReactiveFormsModule } from "@angular/forms";
import {
    injectMutation,
    injectQuery,
} from "@tanstack/angular-query-experimental";
import { AccountManagementService } from "@/app/services/api/account-management.service";

@Component({
    selector: "hbp-doctor-profile-notifications",
    standalone: true,
    imports: [SingleCheckBoxComponent, ButtonComponent, ReactiveFormsModule],
    templateUrl: "./doctor-profile-notifications.component.html",
    styleUrl: "./doctor-profile-notifications.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorProfileNotificationsComponent extends HBForm {
    #accountManager = inject(AccountManagementService);

    constructor() {
        super();
        effect(() => {
            this.form.patchValue({ ...this.emailPreferences() });
        });
    }

    protected emailPreferencesQuery = injectQuery(() => ({
        queryKey: ["emailPreferences"],
        queryFn: () => this.#accountManager.getEmailPreferences(),
    }));

    emailPreferences = computed(() => this.#accountManager.getPreferences());

    protected savePreferencesMutation = injectMutation(() => ({
        mutationFn: (data: Preferences) =>
            this.#accountManager.saveEmailPreferences(data),
    }));

    override setupForm() {
        return this.fb.group<Preferences>({
            appointmentRescheduled: false,
            appointmentCancelled: false,
            accountInfoUpdated: false,
            accountDeactivated: false,
            appointmentRequested: false,
        });
    }

    public saveNewPreferences() {
        this.savePreferencesMutation.mutate(this.form.value);
    }
}
