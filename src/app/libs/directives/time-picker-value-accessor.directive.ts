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
        "amalitech-time-picker[formControlName], amalitech-time-picker[formControl], amalitech-time-picker[ngModel]",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimePickerValueAccessorDirective),
            multi: true,
        },
    ],
    standalone: true,
})
export class TimePickerValueAccessorDirective implements ControlValueAccessor {
    private elementRef = inject(ElementRef<HTMLAmalitechTimePickerElement>);
    onChange = (value: string | Date) => {};
    onTouched = () => {};

    constructor() {}

    @HostListener("amalitechTimeChange", ["$event"])
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
