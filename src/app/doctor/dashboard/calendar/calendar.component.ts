import { DatePipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    model,
    signal,
} from "@angular/core";
import { DateBuilder } from "@utils";
import { CalendarDayComponent } from "./calendar-day/calendar-day.component";
import { FormsModule } from "@angular/forms";
import { SystemGeneric } from "@/app/libs/types";

const { months } = DateBuilder;

@Component({
    selector: "hbp-calendar",
    standalone: true,
    imports: [DatePipe, CalendarDayComponent, FormsModule],
    templateUrl: "./calendar.component.html",
    styleUrl: "./calendar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
    calendarData = new Map([
        ["January", "2024-01-01"],
        ["February", "2024-02-01"],
        ["March", "2024-03-01"],
        ["April", "2024-04-01"],
        ["May", "2024-05-01"],
        ["June", "2024-06-01"],
        ["July", "2024-07-01"],
        ["August", "2024-08-01"],
        ["September", "2024-09-01"],
        ["October", "2024-10-01"],
        ["November", "2024-11-01"],
        ["December", "2024-12-01"],
    ]);
    date = signal<Date>(new Date());
    selectedMonth = signal<string | undefined>(
        this.calendarData.get(months[this.date().getMonth()]),
    );
    days = computed(() => this.renderCalendar(new Date(this.selectedMonth()!)));

    selectedDate = model.required<Date>();
    monthsOfCalendar = Array.from(this.calendarData.keys());

    getNumberOfDaysInMonth(date: Date) {
        return DateBuilder.getEndOfMonth(date).getDate();
    }

    renderCalendar(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDateOfMonth = new Date(year, month, 1);
        const dayMonthStartsAt = Number(firstDateOfMonth.getDay()) % 7;
        const numOfDaysInMonth = this.getNumberOfDaysInMonth(date);

        /**
         * Calendar starts from Monday but other months bleed into the next months
         * i.e May's dates end at Friday and June days start on Sat 2024
         * We want to take those "bleeding days" into account with
         * this.numOfDaysInMonth + (dayMonthStartsAt)
         * */
        return Array.from(
            { length: numOfDaysInMonth + dayMonthStartsAt },
            (_: SystemGeneric, i: number) => {
                const dayDate = new Date(year, month, i - dayMonthStartsAt + 1);
                if (i < dayMonthStartsAt) {
                    return undefined;
                } else if (i - dayMonthStartsAt === 0) {
                    return { date: dayDate, day: 1 };
                }
                return { date: dayDate, day: i - dayMonthStartsAt + 1 };
            },
        );
    }

    getFormattedDate = DateBuilder.getFormattedDate;

    goToNextMonth() {
        this.selectedMonth.set(
            this.calendarData.get(months[this.date().getMonth() + 1]),
        );
        if (this.date().getMonth() + 1 === 12) {
            this.date.set(new Date(this.date().getFullYear()));
            this.selectedMonth.set(this.calendarData.get(months[0]));
        } else {
            this.date.set(
                new Date(this.date().getFullYear(), this.date().getMonth() + 1),
            );
        }
    }

    goToPrevMonth() {
        this.selectedMonth.set(
            this.calendarData.get(months[this.date().getMonth() - 1]),
        );
        if (this.date().getMonth() - 1 < 0) {
            this.date.set(new Date(this.date().getFullYear(), 11));
            this.selectedMonth.set(this.calendarData.get(months[11]));
        } else {
            this.date.set(
                new Date(this.date().getFullYear(), this.date().getMonth() - 1),
            );
        }
    }
}
