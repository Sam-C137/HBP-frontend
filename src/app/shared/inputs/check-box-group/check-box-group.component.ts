import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "hbp-check-box-group",
    standalone: true,
    imports: [],
    templateUrl: "./check-box-group.component.html",
    styleUrl: "./check-box-group.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CheckBoxGroupComponent,
            multi: true,
        },
    ],
})
export class CheckBoxGroupComponent implements ControlValueAccessor {
    values: string[] = [];

    onChange = (value: string[]) => {
        void value;
    };
    onTouch = () => {};

    writeValue(value: string[]): void {
        this.values = value;
    }
    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouch = fn;
    }

    toggleValue(selectedValue: string) {
        if (this.values.includes(selectedValue)) {
            this.values = this.values.filter(
                (value) => value !== selectedValue,
            );
        } else {
            this.values = [...this.values, selectedValue];
        }

        this.onChange(this.values);
        this.onTouch();
    }

    isSelected(valueToCheck: string) {
        return this.values.includes(valueToCheck);
    }
}
