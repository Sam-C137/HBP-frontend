import { ClickOutsideDirective } from "@/app/libs/directives";
import { SystemGeneric } from "@/app/libs/types";
import { ServiceManagementService } from "@services/api/service-management.service";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
} from "@angular/core";
import {
    AbstractControl,
    FormControl,
    ReactiveFormsModule,
} from "@angular/forms";
import { InputComponent } from "../input/input.component";
import { HBForm } from "@/app/services";
import { FilterPipe } from "@/app/libs/pipes";
import { injectQuery } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-icon-picker",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ClickOutsideDirective,
        InputComponent,
        FilterPipe,
    ],
    templateUrl: "./icon-picker.component.html",
    styleUrl: "./icon-picker.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPickerComponent extends HBForm {
    id = input.required<string>();
    label = input<string>();
    control = input.required<AbstractControl | FormControl | SystemGeneric>();
    error = input<string>();
    required = input<boolean>(false);
    private serviceManagement = inject(ServiceManagementService);
    selectedIconUrl = model<string>();

    icons = injectQuery(() => ({
        queryKey: ["serviceIcons"],
        queryFn: () =>
            this.serviceManagement.getServiceIcons({
                size: 50,
            }),
    }));

    override setupForm() {
        return this.fb.group({
            search: [""],
        });
    }
}
