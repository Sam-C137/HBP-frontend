import { PreventLeadingSpace } from "@directives";
import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    input,
    OnInit,
    ViewChild,
} from "@angular/core";
import {
    AbstractControl,
    FormControl,
    ReactiveFormsModule,
} from "@angular/forms";
import { Watch } from "@utils";
import { TelPipe } from "@pipes";
import { SystemGeneric } from "@/app/libs/types";

const PASSWORD_INPUT_TYPE = "password";

@Component({
    selector: "hbp-input",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, PreventLeadingSpace, TelPipe],
    templateUrl: "./input.component.html",
    styleUrl: "./input.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TelPipe],
})
export class InputComponent implements OnInit {
    control = input<AbstractControl | FormControl | SystemGeneric>();
    class = input<string>();
    id = input.required<string>();
    type = input<
        "text" | typeof PASSWORD_INPUT_TYPE | "email" | "tel" | "number"
    >("text");
    placeholder = input<string>("");
    name = input<string>();
    label = input<string>();
    iconLeftUrl = input<string>("");
    iconRightUrl = input<string>("");
    controlName = input<string>("");
    required = input<boolean>(false);
    autocomplete = input<string>("");
    autofocus = input<string>("");
    error = input<string>();
    highlightFocus = input<boolean>(true);
    toggleIcons = input<boolean>(true);
    maxLength = input<number>();

    togglePasswordVisibility(element: HTMLInputElement) {
        if (this.type() === PASSWORD_INPUT_TYPE) {
            if (element?.type === PASSWORD_INPUT_TYPE) {
                element.type = "text";
            } else {
                element.type = PASSWORD_INPUT_TYPE;
            }
        }
    }

    @ViewChild("iconError", { static: true })
    errorIcon?: ElementRef<HTMLImageElement>;

    @Watch("error", { current: true })
    showErrorIcon(val: string) {
        if (val) {
            this.errorIcon
                ? (this.errorIcon.nativeElement.dataset["visible"] = "true")
                : null;
        } else {
            this.errorIcon
                ? (this.errorIcon.nativeElement.dataset["visible"] = "false")
                : null;
        }
    }

    @ViewChild("input", { static: true }) input?: ElementRef<HTMLInputElement>;

    handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const { value } = target;

        if (this.type() === "tel") {
            if (/[^0-9]/.test(value)) {
                const tempValue = value.replace(/[^0-9]/g, "");
                this.control().setValue(tempValue);
            }
        }

        if (this.type() === "number") {
            if (/[^0-9]/.test(value)) {
                const tempValue = value.replace(/[^0-9]/g, "");
                this.control().setValue(tempValue);
            }
        }

        if (this.maxLength() && this.input) {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > this.maxLength()!) {
                const tempValue = numericValue.slice(0, this.maxLength());
                this.control().setValue(tempValue);
                this.formatText(tempValue);
            }
        }
    }

    private cdr = inject(ChangeDetectorRef);
    private telPipe = inject(TelPipe);

    ngOnInit() {
        this.cdr.detectChanges();
        this.formatText(this.control().value);
    }

    formatText(value: string) {
        if (this.input) {
            this.input.nativeElement.value = this.telPipe.transform(
                value,
                this.type() === "tel",
            );
        }
    }
}
