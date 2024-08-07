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
            useExisting: forwardRef(
                () => CheckboxMultipleValueAccessorDirective,
            ),
            multi: true,
        },
    ],
    standalone: true,
})
export class CheckboxMultipleValueAccessorDirective
    implements ControlValueAccessor
{
    private elementRef = inject(ElementRef<HTMLAmalitechCheckboxElement>);
    private checkboxService = inject(CheckboxService);
    onChange = (value: string[] | null) => {};
    onTouched = () => {};

    constructor() {}

    @HostListener("valueChange", ["$event"])
    onHostChange(event: CustomEvent) {
        if (event.detail.checked) {
            this.checkboxService.selectedValues.push(event.detail.value);
        } else {
            const index = this.checkboxService.selectedValues.indexOf(
                event.detail.value,
            );
            if (index >= 0) {
                this.checkboxService.selectedValues.splice(index, 1);
            }
        }
        this.onChange(this.checkboxService.selectedValues);
        this.writeValue(this.checkboxService.selectedValues);
    }

    @HostListener("blur")
    onHostBlur() {
        this.onTouched();
    }

    writeValue(value: string[] | null): void {
        if (value) {
            if (value.includes(this.elementRef.nativeElement.value)) {
                this.elementRef.nativeElement.setAttribute("checked", "true");
            } else {
                this.elementRef.nativeElement.removeAttribute("checked");
            }
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

@Injectable({
    providedIn: "root",
})
class CheckboxService {
    selectedValues: string[] = [];
}
