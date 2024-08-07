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
        "amalitech-radio-group[formControlName], amalitech-radio-group[formControl], amalitech-radio-group[ngModel]",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioGroupValueAccessorDirective),
            multi: true,
        },
    ],
    standalone: true,
})
export class RadioGroupValueAccessorDirective implements ControlValueAccessor {
    private elementRef = inject(ElementRef<HTMLAmalitechCheckboxElement>);

    onChange = (value: string | null) => {};
    onTouched = () => {};

    constructor() {}

    @HostListener("valueChange", ["$event"])
    onHostChange(event: CustomEvent) {
        this.onChange(event.detail.value);
        this.writeValue(event.detail.value);
    }

    @HostListener("blur")
    onHostBlur() {
        this.onTouched();
    }

    writeValue(value: string | null): void {
        const buttons = this.elementRef.nativeElement.querySelectorAll(
            "amalitech-radio-button",
        );

        buttons.forEach((button: HTMLAmalitechRadioButtonElement) => {
            if (button.value === value) {
                button.setAttribute("checked", "true");
            } else {
                button.removeAttribute("checked");
            }
        });
    }

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
