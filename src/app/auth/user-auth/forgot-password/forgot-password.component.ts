import { ButtonComponent } from "@shared/button/button.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { HBForm } from "@services";
import { RouterLink } from "@angular/router";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { AuthenticationService } from "@services/api/authentication.service";
import { Title } from "@/app/utils";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { MailCheckComponent } from "../mail-check/mail-check.component";

@Component({
    selector: "hbp-forgot-password",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        RouterLink,
        SpinnerComponent,
        MailCheckComponent,
    ],
    templateUrl: "./forgot-password.component.html",
    styleUrls: [
        "./forgot-password.component.scss",
        "../../../libs/stylesheets/auth-forms.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends HBForm {
    @Title
    readonly title = "Forgot Password";
    private authentication = inject(AuthenticationService);
    public status: "request" | "mail-check" = "request";
    public userEmail?: string;

    public resetMutation = injectMutation(() => ({
        mutationFn: (email: string) =>
            this.authentication.requestPasswordReset(email),
        onSuccess: (data, variables) => {
            this.userEmail = variables;
            this.status = "mail-check";
        },
    }));

    override setupForm() {
        return this.fb.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    public submit() {
        if (this.form.valid) {
            this.resetMutation.mutate(this.form.value.email);
            this.form.reset();
        }
    }
}
