/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    QueryList,
    ViewChildren,
    computed,
    input,
    output,
} from "@angular/core";

@Component({
    selector: "hbp-otp-input",
    standalone: true,
    imports: [],
    templateUrl: "./otp-input.component.html",
    styleUrl: "./otp-input.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {
    length = input.required<number>();
    label = input<string>("Verification Code");
    submit = output<string>();

    public arr = computed(() => Array(this.length()).fill("💪"));
    @ViewChildren("input") inputs?: QueryList<ElementRef<HTMLInputElement>>;

    onInput(e: Event, index: number) {
        if (index === this.length() - 1) {
            let out = "";
            this.inputs?.forEach((el) => {
                out += el.nativeElement.value;
                el.nativeElement.disabled = true;
            });
            this.submit.emit(out);
        } else {
            e.target.nextElementSibling?.focus();
        }
    }

    onKeydown(e: KeyboardEvent) {
        if (e.key === "Backspace") {
            e.target.previousElementSibling.value = "";
            e.target.previousElementSibling.focus();
        }
    }

    onFocus(e: Event, index: number) {
        const inputsArray = this.inputs?.toArray();

        for (let i = 0; i < index; i++) {
            if (inputsArray && inputsArray[i].nativeElement.value === "") {
                e.preventDefault();
                inputsArray[i].nativeElement.focus();
                return;
            }
        }
    }

    onPaste(e: ClipboardEvent) {
        e.preventDefault();
        const text = e.clipboardData?.getData("text");
        if (text?.length === this.length()) {
            let out = "";
            this.inputs?.forEach((el, i) => {
                const value = text[i];
                out += value;
                el.nativeElement.value = value;
                el.nativeElement.disabled = true;
            });
            this.submit.emit(out);
        }
    }

    public clear() {
        this.inputs?.forEach((el) => {
            el.nativeElement.value = "";
            el.nativeElement.disabled = false;
        });
    }
}
