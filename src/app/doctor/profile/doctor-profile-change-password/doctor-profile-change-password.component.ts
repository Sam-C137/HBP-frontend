import { ChangePassword } from "@/app/patient/profile/change-password/change-password.types";
import { HBForm } from "@/app/services";
import { AccountManagementService } from "@/app/services/api/account-management.service";
import { ButtonComponent } from "@/app/shared/button/button.component";
import { InputComponent } from "@/app/shared/inputs/input/input.component";
import {
    passwordMatchValidator,
    passwordsDoNotMatchValidator,
    passwordStrengthValidator,
} from "@/app/utils";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-doctor-profile-change-password",
    standalone: true,
    imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
    templateUrl: "./doctor-profile-change-password.component.html",
    styleUrl: "./doctor-profile-change-password.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorProfileChangePasswordFormComponent extends HBForm {
    ChangePasswordForm!: FormGroup;
    #accountManager = inject(AccountManagementService);

    changePasswordMutation = injectMutation(() => ({
        mutationFn: (data: { oldPassword: string; newPassword: string }) =>
            this.#accountManager.changePassword(data),
    }));

    override setupForm() {
        this.ChangePasswordForm = new FormGroup<ChangePassword>(
            {
                currentPassword: new FormControl("", {
                    nonNullable: true,
                    validators: Validators.required,
                }),
                password: new FormControl("", {
                    nonNullable: true,
                    validators: [
                        passwordStrengthValidator,
                        Validators.required,
                        Validators.minLength(8),
                    ],
                }),
                confirmPassword: new FormControl("", { nonNullable: true }),
            },

            {
                validators: [
                    passwordMatchValidator("password", "confirmPassword"),
                    passwordsDoNotMatchValidator("password", "currentPassword"),
                ],
            },
        );
        return this.ChangePasswordForm;
    }

    submitPasswordChange() {
        if (!this.ChangePasswordForm.valid) {
            this.ChangePasswordForm.markAllAsTouched();
            return;
        }

        this.changePasswordMutation.mutate({
            oldPassword: this.ChangePasswordForm.value.currentPassword,
            newPassword: this.ChangePasswordForm.value.password,
        });
        this.ChangePasswordForm.reset();
    }

    get currentPassword() {
        return this.ChangePasswordForm.get("currentPassword");
    }

    get password() {
        return this.ChangePasswordForm.get("password");
    }

    get confirmPassword() {
        return this.ChangePasswordForm.get("confirmPassword");
    }
}
