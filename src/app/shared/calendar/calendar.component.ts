import {
    ChangeDetectionStrategy,
    Component,
    input,
    OnInit,
} from "@angular/core";
import { Cache, DateBuilder, lighten, Watch } from "@utils";
import { TimePipe } from "@pipes";
import { Appointment, Roles, Service, User } from "@types";

type CalendarConfig = {
    userRole: Roles;
    detailPrecision: "precise" | "shallow";
    activeColor: "red" | "blue" | "inheritFromService";
    moveTo?: "mostRecent" | "today";
};

@Component({
    selector: "hbp-calendar",
    standalone: true,
    imports: [TimePipe],
    templateUrl: "./calendar.component.html",
    styleUrl: "./calendar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
    private appointments: Appointment[] = [];
    protected Roles = Roles;
    protected lighten = lighten;
    schedule = input.required<Date[], Appointment[]>({
        transform: (appointments) => {
            return appointments.map((appointment) => {
                this.appointments.push(appointment);
                return new Date(appointment.appointmentTime);
            });
        },
    });
    config = input<CalendarConfig>({
        userRole: Roles.Patient,
        detailPrecision: "shallow",
        activeColor: "red",
        moveTo: "mostRecent",
    });
    public viewmode: "day" | "week" | "month" | "year" = "week";
    protected today = new Date();
    protected date = new Date();
    protected DateBuilder = DateBuilder;
    public months = DateBuilder.months;
    public days = DateBuilder.days;
    public dateFill: Date[] = [];

    ngOnInit(): void {
        this.setToday();
        if (this.config().moveTo === "mostRecent") {
            this.moveToRecentAppointment();
        }
        this.setCurrentSchedule();
    }

    private fillCalendar(): void {
        this.dateFill = Array.from({ length: 7 * 11 }, (_, index) => {
            const day = index % 7;
            const hour = Math.floor(index / 7) + 7;
            const date = new Date(this.date);
            date.setDate(date.getDate() - date.getDay() + day);
            date.setHours(hour);
            return date;
        });
    }

    public setToday(): void {
        const dayOfWeek = this.today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        this.date = new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            this.today.getDate() + diff,
        );
        this.fillCalendar();
    }

    private moveToRecentAppointment(): void {
        if (this.appointments.length > 0) {
            this.date = new Date(
                new Date(this.appointments[0].appointmentTime).getFullYear(),
                new Date(this.appointments[0].appointmentTime).getMonth(),
                new Date(this.appointments[0].appointmentTime).getDate(),
            );
        }
        this.fillCalendar();
    }

    @Watch("schedule")
    private setCurrentSchedule(): void {
        if (this.schedule.length > 0) {
            this.date = this.schedule()[0];
        }
    }

    public handleNext(): void {
        this.date = DateBuilder.handleNext(this.date, this.viewmode);
        this.fillCalendar();
    }

    public handlePrev(): void {
        this.date = DateBuilder.handlePrev(this.date, this.viewmode);
        this.fillCalendar();
    }

    public isActive(index: number): boolean {
        const date = this.dateFill[index];

        return this.schedule().some(
            (schedule) => date.getTime() === schedule.getTime(),
        );
    }

    public getActiveColor(date: Date): string {
        switch (this.config().activeColor) {
            case "red":
                return "var(--red-600)";
            case "blue":
                return "var(--secondary-600)";
            default:
                return (
                    this.getRelatedServiceByDate(date)?.colorCode || "inherit"
                );
        }
    }

    @Cache
    public getRelatedUserByDate(date: Date): Partial<User> | undefined {
        const appointment = this.getAppointmentByDate(date);
        if (appointment.length === 0) {
            return undefined;
        }
        return appointment[0].relatedUser;
    }

    @Cache
    public getRelatedServiceByDate(date: Date): Partial<Service> | undefined {
        const appointment = this.getAppointmentByDate(date);
        if (appointment.length === 0) {
            return undefined;
        }
        return appointment[0].relatedService;
    }

    @Cache
    public getAppointmentByDate(date: Date): Appointment[] {
        return this.appointments.filter(
            (appointment) =>
                new Date(appointment.appointmentTime).getTime() ===
                date.getTime(),
        );
    }

    @Cache
    public getTime(index: number): string {
        const times = [
            "7 AM",
            "8 AM",
            "9 AM",
            "10 AM",
            "11 AM",
            "12 PM",
            "1 PM",
            "2 PM",
            "3 PM",
            "4 PM",
            "5 PM",
        ];
        if (index % 7 !== 0) {
            return "";
        }

        return times[Math.floor((index - 1) / 7) + 1];
    }
}
