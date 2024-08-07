/* eslint-disable */
//@ts-nocheck
import {
    ClickOutsideDirective,
    TimePickerValueAccessorDirective,
} from "@directives";
import { TimePipe } from "@pipes";
import { SystemGeneric } from "@types";
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    input,
    viewChild,
} from "@angular/core";
import {
    AbstractControl,
    FormControl,
    ReactiveFormsModule,
} from "@angular/forms";
import { SpinnerComponent } from "../../loaders/spinner/spinner.component";

@Component({
    selector: "hbp-time-picker",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TimePickerValueAccessorDirective,
        TimePipe,
        ClickOutsideDirective,
        SpinnerComponent,
    ],
    templateUrl: "./time-picker.component.html",
    styleUrl: "./time-picker.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TimePickerComponent {
    id = input.required<string>();
    placeholder = input<string>("Pick a time");
    control = input.required<AbstractControl | FormControl | SystemGeneric>();
    label = input<string>();
    meridian = input<boolean>(true);
    showSpinners = input<boolean>(true);
    required = input<boolean>(false);
    useList = input<boolean>(false);
    timeList = input<string[]>([]);
    loadingState = input<boolean | undefined>(false);
    error = input<string>();

    timePicker =
        viewChild.required<ElementRef<HTMLAmalitechTimePickerElement>>(
            "picker",
        );
    dropdown = viewChild<ElementRef<HTMLDivElement>>("dropdown");

    toggleOpen() {
        if (this.showSpinners()) {
            this.timePicker().nativeElement.open();
            return;
        }

        if (this.useList()) {
            this.dropdown()?.nativeElement.classList.add("open");
        }
    }
}
