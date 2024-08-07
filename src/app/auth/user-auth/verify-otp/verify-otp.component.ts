import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AuthenticationService } from "@services/api/authentication.service";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { ButtonComponent } from "@shared/button/button.component";
import { OtpInputComponent } from "@shared/inputs/otp-input/otp-input.component";

@Component({
    selector: "hbp-verify-otp",
    standalone: true,
    imports: [SpinnerComponent, ButtonComponent, OtpInputComponent],
    templateUrl: "./verify-otp.component.html",
    styleUrls: [
        "./verify-otp.component.scss",
        "../../../libs/stylesheets/auth-forms.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpComponent {
    private authentication = inject(AuthenticationService);
    private otp?: string;
    public email = "";

    constructor() {
        const { email } = history.state;
        this.email = email;
    }

    public verificationMutation = injectMutation(() => ({
        mutationFn: (otp: string) => this.authentication.verifyCode(otp),
    }));

    public resendVerificationMutation = injectMutation(() => ({
        mutationFn: (email: string) =>
            this.authentication.resendVerificationCode(email),
    }));

    public submit() {
        if (this.otp && !this.verificationMutation.isPending()) {
            this.verificationMutation.mutate(this.otp);
        }
    }

    public verifyOtp(otp: string) {
        this.otp = otp;
        this.submit();
    }

    public resendOtp() {
        if (!this.email) return;
        this.resendVerificationMutation.mutate(this.email);
    }
}
