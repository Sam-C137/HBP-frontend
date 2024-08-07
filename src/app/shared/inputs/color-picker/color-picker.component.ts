import { SystemGeneric } from "@/app/libs/types";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
    FormControl,
    ReactiveFormsModule,
    AbstractControl,
} from "@angular/forms";

@Component({
    selector: "hbp-color-picker",
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: "./color-picker.component.html",
    styleUrl: "./color-picker.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent {
    id = input.required<string>();
    label = input<string>();
    control = input.required<AbstractControl | FormControl | SystemGeneric>();
    error = input<string>();
}
