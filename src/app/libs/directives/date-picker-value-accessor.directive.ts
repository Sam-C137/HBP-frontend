/* eslint-disable */
//@ts-nocheck
import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    selector:
        "amalitech-date-picker[formControlName], amalitech-date-picker[formControl], amalitech-date-picker[ngModel]",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerValueAccessorDirective),
            multi: true,
        },
    ],
    standalone: true,
})
export class DatePickerValueAccessorDirective implements ControlValueAccessor {
    private elementRef = inject(ElementRef<HTMLAmalitechDatePickerElement>);
    onChange = (value: string | Date) => {};
    onTouched = () => {};

    constructor() {}

    @HostListener("amalitechDateChange", ["$event"])
    onHostChange(event: CustomEvent) {
        this.onChange(event.detail);
    }

    @HostListener("blur")
    onHostBlur() {
        this.onTouched();
    }

    writeValue(value: string | Date): void {}

    setDisabledState(isDisabled: boolean) {
        this.elementRef.nativeElement.disabled = isDisabled;
    }

    registerOnChange(fn: () => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }
}
