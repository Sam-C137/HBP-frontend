import {
    CUSTOM_ELEMENTS_SCHEMA,
    Component,
    model,
    output,
} from "@angular/core";
import { CheckBoxComponent } from "@shared/inputs/check-box-group/check-box/check-box.component";
import { CheckBoxGroupComponent } from "@shared/inputs/check-box-group/check-box-group.component";
import { RadioGroupValueAccessorDirective } from "@directives";
import { CheckboxMultipleValueAccessorDirective } from "@directives";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { overlayFadeIn, slidingSidebar } from "@app/libs/animations";
import { RadioGroupComponent } from "@shared/inputs/radio-group/radio-group.component";
import { RadioButtonComponent } from "@shared/inputs/radio-group/radio-button/radio-button.component";

@Component({
    selector: "hbp-filter-table",
    standalone: true,
    imports: [
        CheckBoxGroupComponent,
        CheckBoxComponent,
        CheckboxMultipleValueAccessorDirective,
        RadioGroupValueAccessorDirective,
        ReactiveFormsModule,
        RadioGroupComponent,
        RadioButtonComponent,
    ],
    templateUrl: "./filter-table.component.html",
    styleUrl: "./filter-table.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    animations: [slidingSidebar, overlayFadeIn],
})
export class FilterTableComponent {
    form = model.required<FormGroup>();
    filtersMenuIsVisible = model<boolean>(false);
    closeFilter = output<boolean>();

    closeFilterTable() {
        this.closeFilter.emit(false);
    }
}
