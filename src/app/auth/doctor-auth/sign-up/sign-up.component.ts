import { ButtonComponent } from "@shared/button/button.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthenticationService } from "@services/api/authentication.service";
import { RouterLink } from "@angular/router";
import { HBForm } from "@services";
import { Roles, type RegisterUserDetails } from "@types";
import { nameValidator, passwordStrengthValidator, Title } from "@utils";
import { SpinnerComponent } from "@/app/shared/loaders/spinner/spinner.component";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-doctor-sign-up",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        RouterLink,
        SpinnerComponent,
    ],
    templateUrl: "./sign-up.component.html",
    styleUrls: [
        "./sign-up.component.scss",
        "../../../libs/stylesheets/auth-forms.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorSignUpComponent extends HBForm {
    @Title
    readonly title = "Doctor Register";
    private authentication = inject(AuthenticationService);

    public registerMutation = injectMutation(() => ({
        mutationFn: (credentials: RegisterUserDetails) =>
            this.authentication.register(credentials, Roles.Doctor),
    }));

    override setupForm() {
        return this.fb.group({
            name: [
                "",
                [Validators.required, Validators.minLength(4), nameValidator()],
            ],
            email: ["", [Validators.required, Validators.email]],
            password: [
                "",
                [
                    Validators.required,
                    Validators.minLength(8),
                    passwordStrengthValidator(),
                ],
            ],
        });
    }

    public submit() {
        if (this.form.valid) {
            const { name } = this.form.value;
            delete this.form.value.name;

            this.registerMutation.mutate({
                ...this.form.value,
                firstname: name.split(" ")[0].trim(),
                lastname: name.split(" ")[1].trim(),
            });
            this.form.reset();
        }
    }
}
