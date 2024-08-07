import { DatePickerValueAccessorDirective } from "@directives";
import { DatePipe as CustomDatePipe } from "@pipes";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    inject,
    input,
    viewChild,
} from "@angular/core";
import {
    AbstractControl,
    FormControl,
    ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { SystemGeneric } from "@/app/libs/types";
import { concatMap, tap } from "rxjs";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";

@Component({
    selector: "hbp-date-picker",
    standalone: true,
    imports: [
        DatePickerValueAccessorDirective,
        ReactiveFormsModule,
        CustomDatePipe,
        CommonModule,
    ],
    templateUrl: "./date-picker.component.html",
    styleUrl: "./date-picker.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [DatePipe],
})
export class DatePickerComponent implements OnInit {
    id = input.required<string>();
    placeholder = input<string>("Pick a date");
    control = input.required<AbstractControl | FormControl | SystemGeneric>();
    min = input<string | Date>();
    max = input<string | Date>();
    label = input<string>();
    required = input<boolean>(false);

    elementRef = viewChild.required<ElementRef<HTMLElement>>("picker");
    datePipe = inject(DatePipe);

    queue: unknown[] = [undefined, undefined];

    private prev = toObservable(this.control)
        .pipe(
            concatMap((control) => control.valueChanges),
            tap((val) => {
                this.queue.shift();
                this.queue.push(val);
            }),
            takeUntilDestroyed(),
        )
        .subscribe();

    ngOnInit() {
        if (this.control().value) {
            this.elementRef().nativeElement.setAttribute(
                "value",
                this.datePipe.transform(
                    this.control().value,
                    "yyyy-MM-dd",
                ) as string,
            );
        }
    }
}
