import { ButtonComponent } from "@shared/button/button.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ToastService } from "@shared/toast/toast.service";
import { popup } from "@app/libs/animations/component.animations";
import { Roles } from "@types";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    model,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { UserManagementService } from "@services/api/user-management.service";
import { FormValidator } from "@utils";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-invite-doctor",
    standalone: true,
    imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
    templateUrl: "./invite-doctor.component.html",
    styleUrls: [
        "./invite-doctor.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [popup],
})
export class InviteDoctorComponent {
    public open = model.required<boolean>();
    public emailList: string[] = [];
    private toastService = inject(ToastService);
    private fb = inject(FormBuilder);
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Doctor,
    );
    form: FormGroup;
    formValidator: FormValidator;

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
    }

    setupForm() {
        return this.fb.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    inviteDoctorMutation = injectMutation(() => ({
        mutationFn: (emails: string[]) =>
            this.userManagementService.inviteUsers(emails),
        onSuccess: () => {
            this.close();
        },
    }));

    submit() {
        if (this.emailList.length < 1) {
            this.toastService.toast({
                message: "Please add at least one email",
                status: "error",
            });
            return;
        }
        this.inviteDoctorMutation.mutate(this.emailList);
    }

    addEmail(event: KeyboardEvent) {
        if (event.key === "Enter") {
            const email = this.form.get("email");
            if (email?.valid && email?.value) {
                this.emailList.push(email.value);
                this.form.get("email")?.reset();
            }
        }
    }

    removeEmail(email: string) {
        this.emailList = this.emailList.filter((e) => e !== email);
    }

    close() {
        this.open.set(false);
        this.emailList = [];
        this.form.reset();
    }
}
