import { HBForm } from "@services";
import { AuthenticationService } from "@services/api/authentication.service";
import { Title } from "@utils";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ButtonComponent } from "@shared/button/button.component";
import { RouterLink } from "@angular/router";
import { type LoginUserDetails } from "@types";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { CheckBoxComponent } from "@shared/inputs/check-box-group/check-box/check-box.component";
import { CheckBoxGroupComponent } from "@shared/inputs/check-box-group/check-box-group.component";

@Component({
    selector: "hbp-login",
    standalone: true,
    imports: [
        InputComponent,
        ButtonComponent,
        RouterLink,
        ReactiveFormsModule,
        SpinnerComponent,
        CheckBoxComponent,
        CheckBoxGroupComponent,
    ],
    templateUrl: "./login.component.html",
    styleUrls: [
        "./login.component.scss",
        "../../../libs/stylesheets/auth-forms.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends HBForm {
    @Title
    readonly title = "Login";
    private authentication = inject(AuthenticationService);

    public loginMutation = injectMutation(() => ({
        mutationFn: (credentials: LoginUserDetails) =>
            this.authentication.login(credentials),
    }));

    override setupForm() {
        return this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8)]],
        });
    }

    public submit() {
        if (this.form.valid) {
            this.loginMutation.mutate(this.form.value);
            this.form.reset();
        }
    }
}
