import { Component } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "hbp-radio-group",
    standalone: true,
    imports: [],
    templateUrl: "./radio-group.component.html",
    styleUrl: "./radio-group.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioGroupComponent,
            multi: true,
        },
    ],
})
export class RadioGroupComponent implements ControlValueAccessor {
    value = "";
    onChange = (selectedValue: string) => {
        void selectedValue;
    };
    onTouched = () => {};

    isSelected(selectedValue: string) {
        return this.value === selectedValue;
    }

    toggleValue(selectedValue: string) {
        this.value = selectedValue;
        this.onChange(selectedValue);
        this.onTouched();
    }

    writeValue(selectedValue: string): void {
        this.value = selectedValue;
    }
    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
