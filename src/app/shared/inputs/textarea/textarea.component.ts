import { PreventLeadingSpace } from "@directives";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    ReactiveFormsModule,
} from "@angular/forms";
import { SystemGeneric } from "@/app/libs/types";

@Component({
    selector: "hbp-textarea",
    standalone: true,
    imports: [ReactiveFormsModule, PreventLeadingSpace],
    templateUrl: "./textarea.component.html",
    styleUrl: "./textarea.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
    id = input.required<string>();
    label = input<string>();
    placeholder = input<string>();
    rows = input<number>(8);
    control = input.required<AbstractControl | FormControl | SystemGeneric>();
    error = input<string>();
    required = input<boolean>();
}
