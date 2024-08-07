import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { type ChangePassword } from "./change-password.types";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ButtonComponent } from "@shared/button/button.component";
import {
    passwordMatchValidator,
    passwordStrengthValidator,
    passwordsDoNotMatchValidator,
} from "@utils";
import { HBForm } from "@services";
import { AccountManagementService } from "@services/api/account-management.service";
import { Title } from "@utils";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-change-password",
    standalone: true,
    imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
    templateUrl: "./change-password.component.html",
    styleUrls: [
        "./change-password.component.scss",
        "../profile-management.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent extends HBForm implements OnInit {
    @Title
    title = "Change Password";
    changePasswordForm!: FormGroup;
    #accountManager = inject(AccountManagementService);

    changePasswordMutation = injectMutation(() => ({
        mutationFn: (data: { oldPassword: string; newPassword: string }) =>
            this.#accountManager.changePassword(data),
    }));

    override setupForm() {
        this.changePasswordForm = new FormGroup<ChangePassword>(
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
        return this.changePasswordForm;
    }

    submitPasswordChange() {
        if (!this.changePasswordForm.valid) {
            this.changePasswordForm.markAllAsTouched();
            return;
        }

        this.changePasswordMutation.mutate({
            oldPassword: this.changePasswordForm.value.currentPassword,
            newPassword: this.changePasswordForm.value.password,
        });
        this.changePasswordForm.reset();
    }

    get currentPassword() {
        return this.changePasswordForm.get("currentPassword");
    }
    get password() {
        return this.changePasswordForm.get("password");
    }
    get confirmPassword() {
        return this.changePasswordForm.get("confirmPassword");
    }
}
