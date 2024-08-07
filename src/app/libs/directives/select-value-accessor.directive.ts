/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @angular-eslint/directive-selector */
// @ts-nocheck
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
        "amalitech-select[multiple][formControlName], amalitech-select[multiple][formControl], amalitech-select:not([multiple])[formControlName], amalitech-select:not([multiple])[formControl]",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectValueAccessorDirective),
            multi: true,
        },
    ],
    standalone: true,
})
export class SelectValueAccessorDirective implements ControlValueAccessor {
    private elementRef = inject(ElementRef<HTMLAmalitechSelectElement>);
    onChange = () => {};
    onTouched = () => {};

    constructor() {}

    @HostListener("amalitechChange", ["$event"])
    onHostChange(event: CustomEvent) {
        this.onChange(
            event.detail.values
                ? Array.from(event.detail.values)
                : event.detail.value,
        );
    }

    @HostListener("blur")
    onHostBlur() {
        this.onTouched();
    }

    writeValue(value: string | Array<string>): void {
        const options = this.elementRef.nativeElement.querySelectorAll(
            "amalitech-select-option",
        );

        if (value === null) {
            this.elementRef.nativeElement.clear();
        }

        if (
            this.elementRef.nativeElement.hasAttribute("multiple") &&
            Array.isArray(value)
        ) {
            options.forEach((option: HTMLAmalitechSelectOptionElement) => {
                value.includes(option.getAttribute("value") as string)
                    ? option.setAttribute("selected", "true")
                    : option.removeAttribute("selected");
            });
        } else {
            options.forEach((option: HTMLAmalitechSelectOptionElement) => {
                option.getAttribute("value") === value
                    ? option.setAttribute("selected", "true")
                    : option.removeAttribute("selected");
            });
        }
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
