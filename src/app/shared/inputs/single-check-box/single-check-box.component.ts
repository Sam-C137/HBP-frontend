import { LowerCasePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
} from "@angular/forms";

@Component({
    selector: "hbp-single-check-box",
    standalone: true,
    imports: [LowerCasePipe, ReactiveFormsModule],
    templateUrl: "./single-check-box.component.html",
    styleUrl: "./single-check-box.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SingleCheckBoxComponent,
            multi: true,
        },
    ],
})
export class SingleCheckBoxComponent implements ControlValueAccessor {
    isChecked = false;
    label = input.required<string>();

    onChange = (value: boolean) => {
        void value;
    };
    onTouch = () => {};

    writeValue(val: boolean): void {
        this.isChecked = val;
    }
    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouch = fn;
    }
    onChanged(event: Event) {
        this.isChecked = (event.target as HTMLInputElement).checked;
        this.onChange(this.isChecked);
    }
}
