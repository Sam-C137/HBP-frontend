import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthenticationService } from "@services/api/authentication.service";
import { ButtonComponent } from "@shared/button/button.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { HBForm } from "@services";
import { passwordMatchValidator } from "@utils";
import { ActivatedRoute } from "@angular/router";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { SetNewPasswordDetails } from "@types";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-password-reset",
    standalone: true,
    imports: [
        InputComponent,
        ButtonComponent,
        ReactiveFormsModule,
        SpinnerComponent,
    ],
    templateUrl: "./password-reset.component.html",
    styleUrls: [
        "./password-reset.component.scss",
        "../../../libs/stylesheets/auth-forms.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent extends HBForm {
    private authentication = inject(AuthenticationService);
    private route = inject(ActivatedRoute);
    private otp?: string;
    public email?: string;

    constructor() {
        super();
        this.route.params.subscribe((params) => {
            const { email, otp } = params;
            (this.email = email), (this.otp = otp);
        });
    }

    public resetMutation = injectMutation(() => ({
        mutationFn: (credentials: SetNewPasswordDetails) =>
            this.authentication.setNewPassword(credentials),
    }));

    override setupForm() {
        return this.fb.group(
            {
                password: ["", [Validators.required, Validators.minLength(8)]],
                confirmPassword: [
                    "",
                    [Validators.required, Validators.minLength(8)],
                ],
            },
            {
                validators: passwordMatchValidator(
                    "password",
                    "confirmPassword",
                ),
            },
        );
    }

    public submit() {
        if (this.form.valid) {
            if (!this.email || !this.otp) return;
            this.resetMutation.mutate({
                password: this.form.value.password,
                email: this.email,
                otp: this.otp,
            });

            this.form.reset();
        }
    }
}
