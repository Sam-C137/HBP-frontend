import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    input,
    OnInit,
    output,
    Signal,
    signal,
    viewChild,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Doctor, User } from "@/app/libs/types";
import { ClickOutsideDirective } from "@/app/libs/directives";
import { toSignal } from "@angular/core/rxjs-interop";
import { CollisionDirective } from "@/app/libs/directives/collision.directive";

@Component({
    selector: "hbp-combo-box",
    standalone: true,
    imports: [ReactiveFormsModule, ClickOutsideDirective, CollisionDirective],
    templateUrl: "./combo-box.component.html",
    styleUrl: "./combo-box.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboBoxComponent implements OnInit {
    control = input.required<FormControl>();
    listItems = input<(User | Doctor)[]>([]);
    loading = input.required<boolean>();
    onDoctorChange = output<string>();
    onFilterChange = output<string>();
    combobox = viewChild<ElementRef<Element>>("combobox");

    inputControl = new FormControl();
    inputSignal: Signal<string>;
    focused = signal(false);
    selectedValue = signal("");
    filteredItems = computed(() => {
        if (this.listItems().length > 0) {
            return this.listItems().filter((item) =>
                item.fullName
                    .toLowerCase()
                    .includes(this.inputSignal()?.toLowerCase() ?? ""),
            );
        }
        return [];
    });

    placeholder!: string;

    constructor() {
        this.inputSignal = toSignal(this.inputControl.valueChanges);

        effect(() => {
            if (this.inputSignal()) {
                this.onFilterChange.emit(this.inputSignal());
            }
        });
    }

    ngOnInit() {
        this.placeholder = this.control().value;
    }

    onComboboxClick() {
        this.focused.set(!this.focused());
    }

    onComboItemClick(doctorId: string, name: string) {
        this.selectedValue.set(name);
        this.onDoctorChange.emit(doctorId);
        this.focused.set(false);
        this.inputControl.setValue("");
    }

    onCollision(newClass: string) {
        this.combobox()?.nativeElement.setAttribute("class", newClass);
    }
}
