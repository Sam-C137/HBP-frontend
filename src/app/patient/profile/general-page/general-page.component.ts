import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { UserService } from "@services/state";
import {
    allowEmpty,
    changeComparisonValidator,
    combineValidators,
    extractChangedValues,
    FormValidator,
    nameValidator,
    phoneNumberValidator,
    removeFalsyValues,
    Title,
    validateFileSize,
    validateFileType,
} from "@utils";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    OnInit,
} from "@angular/core";
import { InputComponent } from "@shared/inputs/input/input.component";
import {
    RadioGroupValueAccessorDirective,
    SelectValueAccessorDirective,
} from "@directives";
import { ButtonComponent } from "@shared/button/button.component";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { User } from "@types";
import { AccountManagementService } from "@/app/services/api/account-management.service";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { RadioGroupComponent } from "@shared/inputs/radio-group/radio-group.component";
import { RadioButtonComponent } from "@/app/shared/inputs/radio-group/radio-button/radio-button.component";

@Component({
    selector: "hbp-general-page",
    standalone: true,
    imports: [
        UserAvatarComponent,
        InputComponent,
        RadioGroupValueAccessorDirective,
        ButtonComponent,
        ReactiveFormsModule,
        SelectValueAccessorDirective,
        RadioGroupComponent,
        RadioButtonComponent,
    ],
    templateUrl: "./general-page.component.html",
    styleUrls: ["./general-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GeneralPageComponent implements OnInit {
    @Title
    readonly title = "General Profile";
    private user = inject(UserService).user;
    private cdr = inject(ChangeDetectorRef);
    private accountManager = inject(AccountManagementService);
    protected form!: FormGroup;
    protected formValidator!: FormValidator;
    private formBuilder = inject(FormBuilder);

    ngOnInit() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
    }

    private setupForm() {
        return this.formBuilder.group(
            {
                fullName: [this.user?.fullName || "", [nameValidator()]],
                email: [this.user?.email || "", [Validators.email]],
                gender: [this.user?.gender || ""],
                contact: [
                    this.user?.contact || "",
                    [combineValidators([allowEmpty, phoneNumberValidator(9)])],
                ],
                address: [this.user?.address || ""],
                profilePicture: [
                    this.user?.profilePicture || "",
                    [
                        validateFileType(["png", "jpg", "jpeg", "gif"]),
                        validateFileSize(5000000),
                    ],
                ],
                emergencyName: [this.user?.emergencyName.trim() || ""],
                emergencyPhoneNumber: [
                    this.user?.emergencyPhoneNumber.trim() || "",
                    [combineValidators([allowEmpty, phoneNumberValidator(9)])],
                ],
                emergencyRelationship: [this.user?.emergencyRelationship || ""],
                emergencyEmail: [
                    this.user?.emergencyEmail.trim() || "",
                    [combineValidators([allowEmpty, Validators.email])],
                ],
                emergencyLocation: [this.user?.emergencyLocation.trim() || ""],
            },
            {
                validators: changeComparisonValidator(this.user),
            },
        );
    }

    protected updateProfileMutation = injectMutation(() => ({
        mutationFn: (info: Partial<User>) =>
            this.accountManager.updateProfile(info),
    }));

    protected deleteProfilePictureMutation = injectMutation(() => ({
        mutationFn: () => this.accountManager.removeProfilePicture(),
        onSuccess: () => {
            this.ngOnInit();
            this.cdr.markForCheck();
        },
    }));

    public onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length) {
            const [file] = target.files;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form
                    .get("profilePicture")
                    ?.setValue(reader.result as string);
                this.cdr.markForCheck();
            };
        }
        this.form.get("profilePicture")?.markAsTouched();
    }

    public submit() {
        if (this.form.errors) {
            return;
        }

        const { fullName } = this.form.value;
        let updatedFormValue = extractChangedValues(this.user, this.form.value);
        if (updatedFormValue["fullName"]) {
            updatedFormValue = {
                ...updatedFormValue,
                firstName: fullName.split(" ")[0].trim(),
                lastName: fullName.split(" ")[1].trim(),
            };
            delete updatedFormValue["fullName"];
        }

        this.updateProfileMutation.mutate(removeFalsyValues(updatedFormValue));
    }
}
