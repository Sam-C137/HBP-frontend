import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    computed,
    effect,
    inject,
    signal,
} from "@angular/core";
import { ChartModule, Chart } from "angular-highcharts";
import { ChartData } from "../dashboard.types";
import { DateBuilder } from "@utils";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SelectValueAccessorDirective } from "@directives";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { tap } from "rxjs";
import { HBForm } from "@/app/services";
import { DashboardService } from "@/app/services/api/dashboard.service";
import { UserService } from "@/app/services/state";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { SystemGeneric } from "@/app/libs/types";

const { months } = DateBuilder;

@Component({
    selector: "hbp-chart",
    standalone: true,
    imports: [ChartModule, SelectValueAccessorDirective, ReactiveFormsModule],
    templateUrl: "./chart.component.html",
    styleUrl: "./chart.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChartComponent extends HBForm implements OnInit {
    #dashboardService = inject(DashboardService);
    #userService = inject(UserService);

    chartData = signal<ChartData>({
        total: [],
        cancelled: [],
        completed: [],
    });
    serieTypeSignal = signal<string>("All");
    #destroyRef = inject(DestroyRef);
    yearly = signal<boolean>(false);
    xAxis = computed(() => {
        if (this.yearly()) {
            return months.map((month) => month.substring(0, 3));
        }
        return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    });
    mutableChartData = computed(() => {
        return this.filterFn(this.serieTypeSignal(), this.chartData());
    });
    chart = computed(
        () =>
            new Chart({
                credits: {
                    enabled: false,
                },
                chart: {
                    type: "column",
                },
                title: {
                    text: undefined,
                },
                xAxis: {
                    categories: this.xAxis(),
                },
                yAxis: {
                    gridLineDashStyle: "Dash",
                    gridLineColor: "#AFB1B0",
                    title: undefined,
                },
                colors: ["#1D64F3", "#FF6A7E", "#27FF9F"],
                series: [
                    {
                        name: "Total",
                        data: this.mutableChartData().total,
                        type: "column",
                        borderRadius: 0,
                        pointPadding: 0,
                    },
                    {
                        name: "Cancelled",
                        data: this.mutableChartData().cancelled,
                        type: "column",
                        borderRadius: 0,
                        pointPadding: 0,
                    },
                    {
                        name: "Completed",
                        data: this.mutableChartData().completed,
                        type: "column",
                        borderRadius: 0,
                        pointPadding: 0,
                    },
                ],
            }),
    );
    today = new Date();
    years = DateBuilder.yearGenerator(5);
    months = months;
    currentMonth = months[this.today.getMonth()];
    currentYear = this.today.getFullYear();
    prevSelectedMonth = "";
    prevSelectedYear = "";
    payloadDate = signal<Date>(
        new Date(this.currentYear, this.today.getMonth()),
    );
    chartSeriesTypes = ["All", "Total", "Cancelled", "Completed"];
    chartQuery = injectQuery(() => ({
        queryKey: ["chart-stats", this.yearly(), this.payloadDate()],
        queryFn: () =>
            this.#dashboardService.getChartStats(
                this.#userService.user!.id,
                this.yearly(),
                this.payloadDate(),
            ),
    }));

    constructor() {
        super();
        effect(
            () => {
                if (this.chartQuery.data()) {
                    this.chartData.set(this.chartQuery.data()!);
                }
            },
            { allowSignalWrites: true },
        );
    }
    override ngOnInit(): void {
        super.ngOnInit();
        this.monthControl.valueChanges
            .pipe(
                tap((value) => {
                    if (value) {
                        this.prevSelectedMonth = value;
                        this.payloadDate.set(new Date(this.currentYear, value));
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
        this.yearControl.valueChanges
            .pipe(
                tap((value) => {
                    if (value) {
                        this.prevSelectedYear = value;
                        this.payloadDate.set(new Date(value));
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
        this.serieTypeControl.valueChanges
            .pipe(
                tap((value) => {
                    this.serieTypeSignal.set(value);
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
    }

    override setupForm(): FormGroup<SystemGeneric> {
        return this.nfb.group({
            seriesType: ["All"],
            month: [this.today.getMonth()],
            year: [this.currentYear.toString()],
        });
    }
    toggleSwitch(event: CustomEvent) {
        this.yearly.set(event.detail.checked);
    }

    filterFn(filter: string, chartData: ChartData): ChartData {
        switch (filter) {
            case "Total": {
                return {
                    total: chartData.total,
                    cancelled: [],
                    completed: [],
                };
            }
            case "Cancelled": {
                return {
                    total: [],
                    cancelled: chartData.cancelled,
                    completed: [],
                };
            }
            case "Completed": {
                return {
                    total: [],
                    cancelled: [],
                    completed: chartData.completed,
                };
            }
            default:
                return chartData;
        }
    }

    onSelectChange(event: CustomEvent, controlName: string) {
        if (!event.detail["value"]) {
            if (controlName === "month") {
                this.monthControl.setValue(this.prevSelectedMonth, {
                    emitEvent: false,
                });
            } else if (controlName === "year") {
                this.form.controls[controlName].setValue(
                    this.prevSelectedYear,
                    { emitEvent: false },
                );
            }
        }
    }

    get monthControl() {
        return this.form.get("month") as FormControl;
    }
    get yearControl() {
        return this.form.get("year") as FormControl;
    }
    get serieTypeControl() {
        return this.form.get("seriesType") as FormControl;
    }
}
