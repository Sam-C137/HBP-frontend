import { AuthenticationService } from "@services/api/authentication.service";
import { ButtonComponent } from "@shared/button/button.component";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from "@angular/core";
import { OtpInputComponent } from "@shared/inputs/otp-input/otp-input.component";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-mail-check",
    standalone: true,
    imports: [ButtonComponent, OtpInputComponent, SpinnerComponent],
    templateUrl: "./mail-check.component.html",
    styleUrls: [
        "./mail-check.component.scss",
        "../../../libs/stylesheets/auth-forms.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCheckComponent {
    private authentication = inject(AuthenticationService);
    public email = input<string>();

    public resendMutation = injectMutation(() => ({
        mutationFn: (email: string) =>
            this.authentication.requestPasswordReset(email),
    }));

    public submit() {
        if (!this.email()) return;
        this.resendMutation.mutate(this.email()!);
    }
}
