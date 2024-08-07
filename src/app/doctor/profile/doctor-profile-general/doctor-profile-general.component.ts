import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    inject,
    OnInit,
    QueryList,
    ViewChildren,
} from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import {
    allowEmpty,
    changeComparisonValidator,
    combineValidators,
    extractChangedValues,
    FormValidator,
    maxWords,
    nameValidator,
    phoneNumberValidator,
    removeFalsyValues,
    Title,
    validateFileSize,
    validateFileType,
} from "@utils";
import { AccountManagementService } from "@services/api/account-management.service";
import {
    injectMutation,
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";
import { Doctor, User } from "@types";
import { SelectValueAccessorDirective } from "@directives";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ServiceManagementService } from "@services/api/service-management.service";
import { BarsComponent } from "@shared/loaders/bars/bars.component";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { ButtonComponent } from "@shared/button/button.component";
import { NgIf } from "@angular/common";
import { delay, forkJoin, Observable, tap, timer } from "rxjs";
import { languages } from "@constants";
import { RadioButtonComponent } from "@shared/inputs/radio-group/radio-button/radio-button.component";
import { RadioGroupComponent } from "@shared/inputs/radio-group/radio-group.component";

@Component({
    selector: "hbp-doctor-profile-general",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        UserAvatarComponent,
        SelectValueAccessorDirective,
        InputComponent,
        BarsComponent,
        TextareaComponent,
        ButtonComponent,
        NgIf,
        RadioButtonComponent,
        RadioGroupComponent,
    ],
    templateUrl: "./doctor-profile-general.component.html",
    styleUrl: "./doctor-profile-general.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorProfileGeneralComponent
    implements OnInit, AfterViewInit, AfterViewChecked
{
    @Title
    readonly title = "My Profile";
    protected doctor?: Doctor;
    private cdr = inject(ChangeDetectorRef);
    private accountManager = inject(AccountManagementService);
    private serviceManager = inject(ServiceManagementService);
    protected form!: FormGroup;
    protected formValidator!: FormValidator;
    private formBuilder = inject(FormBuilder);
    public readonly languages = languages;
    private readonly queryClient = injectQueryClient();

    ngOnInit() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        this.form.disable();
        const prevData = this.queryClient.getQueryData<Doctor>([
            "doctor-profile",
        ]);
        if (prevData) {
            this.updateForm(prevData);
        }
        this.handleLanguageChange();
    }

    ngAfterViewInit() {
        this.getSelectNodes();
    }

    ngAfterViewChecked() {
        if (this.profileQuery.data() && !this.afterViewRun) {
            this.getSelectNodes();
        }
    }

    // Queries

    protected readonly profileQuery = injectQuery(() => ({
        queryKey: ["doctor-profile"],
        queryFn: () =>
            this.accountManager.getUserProfile((user) => {
                this.updateForm(user as Doctor);
            }),
    }));

    protected readonly servicesQuery = injectQuery(() => ({
        queryKey: ["landing-page-services"],
        queryFn: () =>
            this.serviceManager.getAll({
                status: "active",
            }),
    }));

    protected updateProfileMutation = injectMutation((client) => ({
        mutationFn: (info: Partial<User>) =>
            this.accountManager.updateProfile(info, this.doctor?.firstLogin),
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ["doctor-profile"],
            });
        },
    }));

    protected deleteProfilePictureMutation = injectMutation(() => ({
        mutationFn: () => this.accountManager.removeProfilePicture(),
        onSuccess: (data) => {
            this.updateForm(data as Doctor);
        },
    }));

    private setupForm(user?: Doctor) {
        this.languageControl.setValue(user?.languages?.split(", ") || []);
        const profileForm = this.formBuilder.group(
            {
                fullName: [
                    user?.fullName || "",
                    [nameValidator(), Validators.required],
                ],
                email: [
                    user?.email || "",
                    [Validators.email, Validators.required],
                ],
                gender: [user?.gender || ""],
                contact: [
                    user?.contact || "",
                    [combineValidators([allowEmpty, phoneNumberValidator(9)])],
                ],
                address: [user?.address || ""],
                profilePicture: [
                    user?.profilePicture || "",
                    [
                        validateFileType(["png", "jpg", "jpeg", "gif"]),
                        validateFileSize(5000000),
                    ],
                ],
                specialization: [user?.specialization || ""],
                languages: [user?.languages || ""],
                bio: [user?.bio || "", [maxWords(250)]],
                education: [user?.education || ""],
                yearsOfExperience: [user?.yearsOfExperience || ""],
            },
            {
                validators: changeComparisonValidator(user),
            },
        );
        this.setDynamicValidators(profileForm);
        return profileForm;
    }

    protected readonly languageControl = new FormControl();

    private handleLanguageChange() {
        this.languageControl.valueChanges.subscribe((value: string[]) => {
            this.form.get("languages")?.setValue(value.join(", "));
        });
    }

    private updateForm(user: Doctor) {
        this.doctor = user;
        this.form = this.setupForm(user);
        this.formValidator = new FormValidator(this.form);
        this.form.enable();
        this.cdr.markForCheck();
    }

    private setDynamicValidators(form: FormGroup) {
        if (!this.doctor || !this.doctor.firstLogin) return;

        const requiredFields = Array.from([
            form.get("contact"),
            form.get("education"),
            form.get("yearsOfExperience"),
            form.get("gender"),
            form.get("languages"),
        ]);

        requiredFields.forEach((field, i) => {
            field?.clearValidators();
            i === 0
                ? field?.setValidators([
                      Validators.required,
                      phoneNumberValidator(10),
                  ])
                : field?.setValidators([Validators.required]);
        });
    }

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

    @ViewChildren("lang") selectNodes?: QueryList<
        ElementRef<HTMLAmalitechSelectOptionElement>
    >;
    private afterViewRun = false;

    private getSelectNodes() {
        if (!this.selectNodes) return;
        if (this.languageControl.value.length > 0) {
            const cvs: Observable<0>[] = [];
            requestAnimationFrame(() => {
                this.selectNodes?.forEach((s) => {
                    this.afterViewRun = true;
                    if (
                        this.languageControl.value.includes(
                            s.nativeElement.value,
                        )
                    ) {
                        cvs.push(
                            timer(0).pipe(tap(() => s.nativeElement.click())),
                        );
                    }
                });
                forkJoin(cvs)
                    .pipe(
                        delay(20),
                        tap(() => document.dispatchEvent(new Event("click"))),
                    )
                    .subscribe();
            });
        }
    }

    public submit() {
        if (this.form.errors || !this.doctor) {
            this.form.markAllAsTouched();
            return;
        }

        const { fullName } = this.form.value;
        let updatedFormValue = extractChangedValues(
            this.doctor,
            this.form.value,
        );
        if (updatedFormValue["fullName"]) {
            updatedFormValue = {
                ...updatedFormValue,
                firstName: fullName.split(" ")[0].trim(),
                lastName: fullName.split(" ")[1].trim(),
            };
            delete updatedFormValue["fullName"];
        }

        if (updatedFormValue["specialization"]) {
            updatedFormValue["specialization"] = this.servicesQuery
                .data()
                ?.content.find(
                    (s) => s.name === updatedFormValue["specialization"],
                )?.id;
        }

        this.updateProfileMutation.mutate(removeFalsyValues(updatedFormValue));
    }
}
