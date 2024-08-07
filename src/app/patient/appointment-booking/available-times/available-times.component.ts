import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { TimePipe } from "@pipes";
import { AppointmentBookingService } from "@/app/services/api/appointment-booking.service";
import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    model,
    OnInit,
    output,
} from "@angular/core";
import { DateBuilder } from "@utils";
import {
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-available-times",
    standalone: true,
    imports: [CommonModule, TimePipe, SpinnerComponent],
    templateUrl: "./available-times.component.html",
    styleUrl: "./available-times.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableTimesComponent implements OnInit {
    timeSelected = output<Date | string>();
    today = model(new Date().toISOString());
    protected timeSelected$?: Date | string;
    private appointmentBookingService = inject(AppointmentBookingService);
    protected currentDay = new Date().toISOString();
    protected readonly DateBuilder = DateBuilder;

    public availableTimesQuery = injectQuery(() => ({
        queryKey: ["availableTimes"],
        queryFn: () =>
            this.appointmentBookingService.getAvailableBookingTimes(
                (time: string) => {
                    this.timeSelected.emit(time);
                },
            ),
        staleTime: 0,
    }));

    protected queryClient = injectQueryClient();

    ngOnInit() {
        const prevData = this.queryClient.getQueryData<string[]>([
            "availableTimes",
        ]);
        if (prevData) {
            this.timeSelected.emit(prevData[0]);
        }
        this.timeSelected.subscribe((time) => (this.timeSelected$ = time));
    }
}
