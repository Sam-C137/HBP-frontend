import { SelectValueAccessorDirective } from "@/app/libs/directives";
import { HBForm } from "@/app/services";
import { DateBuilder } from "@/app/utils";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    DestroyRef,
    inject,
    input,
    OnInit,
    signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Chart, ChartModule } from "angular-highcharts";
import { tap } from "rxjs";
import { AnalyticsService } from "../../services/analytics.service";
import { Service } from "@/app/libs/types";

@Component({
    selector: "hbp-booking-trends-chart",
    standalone: true,
    imports: [ChartModule, ReactiveFormsModule, SelectValueAccessorDirective],
    templateUrl: "./booking-trends-chart.component.html",
    styleUrl: "./booking-trends-chart.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BookingTrendsChartComponent extends HBForm implements OnInit {
    doctorServices = input.required<Service[] | undefined>();
    #destroyRef = inject(DestroyRef);
    #analyticsService = inject(AnalyticsService);

    trendsQuery = injectQuery(() => ({
        queryKey: [
            "booking-trends",
            this.durationSignal(),
            this.timePeriodSignal(),
        ],
        queryFn: () =>
            this.#analyticsService.getBookingTrends({
                metric: this.duration.value,
                month: this.timePeriod.value,
                year: this.timePeriod.value,
            }),
    }));

    today = new Date();
    durations = new Map<string, string>([
        ["WEEKLY", "This Week"],
        ["MONTHLY", "Monthly"],
        ["YEARLY", "Yearly"],
    ]);
    prevSelectedDuration = "";
    prevSelectedService = "";
    prevTimePeriod = this.today.getFullYear();

    years = DateBuilder.yearGenerator(5);
    months = DateBuilder.months;
    week = DateBuilder.days;

    durationSignal = signal("WEEKLY");
    serviceSignal = signal("All Services");
    timePeriodSignal = signal<number>(0);
    xAxis = computed(() => {
        if (this.durationSignal() === "WEEKLY") {
            return this.week;
        } else if (this.durationSignal() === "MONTHLY") {
            return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
        } else {
            return this.months;
        }
    });

    override setupForm(): FormGroup {
        return this.nfb.group({
            services: ["All Services"],
            duration: ["WEEKLY"],
            timePeriod: [this.years[0]],
        });
    }

    chart = computed(
        () =>
            new Chart({
                credits: {
                    enabled: false,
                },
                chart: {
                    type: "spline",
                },
                title: {
                    text: undefined,
                },
                xAxis: {
                    categories: this.xAxis(),
                    title: {
                        text: "Time",
                        style: {
                            fontWeight: "600",
                            fontFamily: "Montserrat",
                        },
                    },
                },
                yAxis: {
                    gridLineDashStyle: "Dash",
                    gridLineColor: "#AFB1B0",
                    title: {
                        text: "Number of appointments booked",
                        style: {
                            fontWeight: "600",
                            fontFamily: "Montserrat",
                        },
                    },
                },
                series: this.doctorServices()?.map((serie) => {
                    return {
                        name: serie.name,
                        type: "spline",
                        data:
                            this.serviceSignal() === "All Services" ||
                            this.services.value === serie.name
                                ? this.trendsQuery.data()
                                    ? this.trendsQuery.data()![serie.name]
                                    : []
                                : [],
                    };
                }),
            }),
    );

    override ngOnInit(): void {
        super.ngOnInit();
        this.services.valueChanges
            .pipe(
                tap((value) => {
                    if (value) {
                        this.prevSelectedService = value;
                        this.serviceSignal.set(value);
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
        this.duration.valueChanges
            .pipe(
                tap((value) => {
                    if (value) {
                        this.prevSelectedDuration = value;
                        if (value === "YEARLY" || value === "WEEKLY") {
                            this.timePeriod.patchValue(this.years[0], {
                                emitEvent: false,
                            });
                        } else if (value === "MONTHLY") {
                            this.timePeriod.patchValue(
                                this.today.getMonth() + 1,
                                { emitEvent: false },
                            );
                        }
                        this.durationSignal.set(value);
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
        this.timePeriod.valueChanges
            .pipe(
                tap((value) => {
                    if (value) {
                        this.prevTimePeriod = value;
                        this.timePeriodSignal.set(value);
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
    }

    onSelectChange(event: CustomEvent, controlName: string) {
        if (!event.detail["value"]) {
            if (controlName === "services") {
                this.services.setValue(this.prevSelectedService, {
                    emitEvent: false,
                });
            } else if (controlName === "duration") {
                this.form.controls[controlName].setValue(
                    this.prevSelectedDuration,
                    { emitEvent: false },
                );
            } else if (controlName === "timePeriod") {
                this.form.controls[controlName].setValue(this.prevTimePeriod, {
                    emitEvent: false,
                });
            }
        }
    }

    get services() {
        return this.form.get("services") as FormControl;
    }

    get duration() {
        return this.form.get("duration") as FormControl;
    }

    get timePeriod() {
        return this.form.get("timePeriod") as FormControl;
    }
}
