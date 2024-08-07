/* eslint-disable */
//@ts-nocheck
import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    Injectable,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    selector:
        "amalitech-checkbox[formControlName], amalitech-checkbox[formControl], amalitech-checkbox[ngModel]",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxSingleValueAccessorDirective),
            multi: true,
        },
    ],
    standalone: true,
})
export class CheckboxSingleValueAccessorDirective
    implements ControlValueAccessor
{
    private elementRef = inject(ElementRef<HTMLAmalitechCheckboxElement>);
    onChange = (value: boolean | null) => {};
    onTouched = () => {};

    constructor() {}

    @HostListener("valueChange", ["$event"])
    onHostChange(event: CustomEvent) {
        this.onChange(event.detail.checked);
        this.writeValue(event.detail.value.checked);
    }

    @HostListener("blur")
    onHostBlur() {
        this.onTouched();
    }

    writeValue(value: boolean | null): void {
        if (value) {
            this.elementRef.nativeElement.setAttribute("checked", "true");
        } else {
            this.elementRef.nativeElement.removeAttribute("checked");
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
