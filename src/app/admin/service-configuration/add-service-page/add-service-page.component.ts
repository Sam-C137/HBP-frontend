import { ButtonComponent } from "@shared/button/button.component";
import { ColorPickerComponent } from "@shared/inputs/color-picker/color-picker.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { ServiceManagementService } from "@services/api/service-management.service";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { type Service } from "@types";
import { FormValidator, removeFalsyValues } from "@utils";
import { IconPickerComponent } from "@shared/inputs/icon-picker/icon-picker.component";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-add-service-page",
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        InputComponent,
        TextareaComponent,
        ColorPickerComponent,
        ReactiveFormsModule,
        ButtonComponent,
        IconPickerComponent,
    ],
    templateUrl: "./add-service-page.component.html",
    styleUrl: "./add-service-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddServicePageComponent implements OnDestroy {
    serviceManagement = inject(ServiceManagementService);
    fb = inject(FormBuilder);
    router = inject(Router);
    form: FormGroup;
    formValidator: FormValidator;
    currentService?: Service;

    constructor() {
        const { service } = history.state as { service?: Service };
        this.currentService = service;
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        this.formValidator
            .setErrorMessage(
                "minlength",
                "Service name cannot be shorter than 3 characters",
            )
            .setErrorMessage(
                "maxlength",
                "Service name cannot be longer than 50 characters",
            );
    }

    creationMutation = injectMutation((client) => ({
        mutationFn: (service: Service) =>
            this.serviceManagement.createService(service),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["services"],
            });
            await client.invalidateQueries({
                queryKey: ["admin-services"],
            });
            await this.router.navigate(["/admin/services"]);
        },
    }));

    updateMutation = injectMutation((client) => ({
        mutationFn: (service: Partial<Service>) => {
            const { id } = service;
            delete service.id;
            return this.serviceManagement.updateService(service, id!);
        },
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["services"],
            });
            await client.invalidateQueries({
                queryKey: ["admin-services"],
            });
            await this.router.navigate(["/admin/services"]);
        },
    }));

    setupForm() {
        return this.fb.group({
            name: [
                this.currentService?.name || "",
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(50),
                ],
            ],
            description: [
                this.currentService?.description || "",
                [Validators.required],
            ],
            icon: [this.currentService?.iconName || "", [Validators.required]],
            colorCode: [this.currentService?.colorCode || "#194D33"],
        });
    }

    submit() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.currentService) {
            const { id } = this.currentService;
            this.updateMutation.mutate(
                removeFalsyValues({
                    ...this.form.value,
                    id,
                }) as Service,
            );
        } else {
            this.creationMutation.mutate(
                removeFalsyValues(this.form.value) as Service,
            );
        }
    }

    ngOnDestroy() {
        history.state.service = {};
    }
}
