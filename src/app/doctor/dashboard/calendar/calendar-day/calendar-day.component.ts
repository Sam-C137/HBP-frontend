import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from "@angular/core";
import { Day } from "../calendar.types";
import { DateBuilder } from "@utils";

@Component({
    selector: "hbp-calendar-day",
    standalone: true,
    imports: [],
    template: `
        <button
            [class.isToday]="isToday()"
            [class.isSelected]="isSelected()"
            class="day"
        >
            {{ day().day }}
        </button>
    `,
    styleUrl: "../calendar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent {
    day = input.required<Day>();
    isSelected = input.required();
    isToday = computed(
        () =>
            DateBuilder.getFormattedDate(this.day().date) ===
            DateBuilder.getFormattedDate(new Date()),
    );
}
