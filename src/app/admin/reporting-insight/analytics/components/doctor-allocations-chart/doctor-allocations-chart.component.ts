import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Chart, ChartModule } from "angular-highcharts";
import { AnalyticsService } from "../../services/analytics.service";
import { Service } from "@/app/libs/types";

@Component({
    selector: "hbp-doctor-allocations-chart",
    standalone: true,
    imports: [ChartModule],
    templateUrl: "./doctor-allocations-chart.component.html",
    styleUrl: "./doctor-allocations-chart.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorAllocationsChartComponent {
    doctorServices = input.required<Service[] | undefined>();
    #analyticsService = inject(AnalyticsService);

    allocationsQuery = injectQuery(() => ({
        queryKey: ["doctor-allocations"],
        queryFn: () => this.#analyticsService.getDoctorAllocations(),
    }));

    chartData = computed(() => {
        const serviceData = [];
        for (const service in this.allocationsQuery.data()) {
            if (this.allocationsQuery.data()) {
                serviceData.push({
                    name: service,
                    type: "column",
                    y: this.allocationsQuery.data()![service] ?? 0,
                });
            }
        }
        return serviceData;
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
                    margin: 20,
                },
                xAxis: {
                    categories: this.doctorServices()?.map(
                        (category) => category.name,
                    ),
                    title: {
                        text: "Services",
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
                        text: "Number of doctors",
                        style: {
                            fontWeight: "600",
                            fontFamily: "Montserrat",
                        },
                    },
                },
                series: [
                    {
                        showInLegend: false,
                        type: "column",
                        color: "#1D64F3",
                        data: this.chartData(),
                    },
                ],
            }),
    );
}
