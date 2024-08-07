import { patientReviews } from "@/app/utils";
import { Component, computed, inject } from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Chart, ChartModule } from "angular-highcharts";
import { AnalyticsService } from "../../services/analytics.service";
import { SeriesPieDataLabelsOptionsObject } from "highcharts";

@Component({
    selector: "hbp-patient-feedback-chart",
    standalone: true,
    imports: [ChartModule],
    templateUrl: "./patient-feedback-chart.component.html",
    styleUrl: "./patient-feedback-chart.component.scss",
})
export class PatientFeedbackChartComponent {
    #analyticsService = inject(AnalyticsService);

    feedbackQuery = injectQuery(() => ({
        queryKey: ["patient-feedback"],
        queryFn: () => this.#analyticsService.getPatientFeedback(),
    }));
    colors = ["#E61C1C", "#FF7D04", "#FFE21C", "#0066FF", "#0DAA0D"];
    pieData = patientReviews;
    chartData = computed(() => {
        const pieSlice = [];
        for (let i = 5; i >= 1; i--) {
            pieSlice.push({
                name: `${this.feedbackQuery.data()?.data[`${i}`]}% of reviews submitted by patients are ${i} star${i === 1 ? "" : "s"}`,
                y: this.feedbackQuery.data()?.data[`${i}`],
                x: i,
                color: this.colors[i - 1],
            });
        }
        return {
            totalReviews: this.feedbackQuery.data()?.totalReviews,
            pieSlice,
        };
    });
    chart = computed(() => {
        const component: PatientFeedbackChartComponent = this;
        const sliceLabel: SeriesPieDataLabelsOptionsObject = {
            distance: -45,
            enabled: true,
            formatter: function () {
                return this.y + "%";
            },
            style: {
                fontWeight: "500",
                fontFamily: "Montserrat",
                color: "white",
                fontStyle: "normal",
                fontSize: ".9rem",
            },
        };
        const extendedLabel: SeriesPieDataLabelsOptionsObject = {
            enabled: true,
            useHTML: true,
            formatter: function () {
                const color: string = this.point.color as string;
                return `<div style='${dataLabelFunc()}'>
                        <div>
                        ${createStars(this.point.x, color)}
                        </div>
                        <p style='${pointNameStyle()}'>${this.point.name}<p>
                        </div>`;
            },
        };
        return new Chart({
            credits: {
                enabled: false,
            },
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 960,
                        },
                        chartOptions: {
                            series: [
                                {
                                    type: "pie",
                                    dataLabels: [
                                        sliceLabel,
                                        {
                                            ...extendedLabel,
                                            enabled: false,
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
            chart: {
                type: "pie",
            },
            title: {
                text: `<p style="font-weight: 500">Total Reviews</p>
                                        <strong style="font-size: 2rem">${component.chartData().totalReviews ?? 0}</strong>`,
                useHTML: true,
                floating: true,
                verticalAlign: "middle",
                style: {
                    fontFamily: "Montserrat",
                    fontSize: "0.9375rem",
                    textAlign: "center",
                },
            },
            tooltip: {
                enabled: false,
            },
            series: [
                {
                    type: "pie",
                    innerSize: "45%",
                    size: "80%",
                    dataLabels: [sliceLabel, extendedLabel],
                    data: this.chartData().pieSlice,
                },
            ],
        });
    });
}
function dataLabelFunc() {
    return `
    display: flex;
    flex-direction: column;
    width: 225px;
    `;
}

function pointNameStyle() {
    return `
    white-space: pre-line;
    font-family: "Montserrat";
    font-size: 1rem;
    font-weight: 500;
    `;
}

function createStars(
    numberOfStars: string | number | undefined,
    color: string,
) {
    let output = "";
    if (numberOfStars) {
        const num = Number(numberOfStars);
        for (let i = 0; i < num; i++) {
            output += `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
<path d="M9.04894 3.34111C9.3483 2.4198 10.6517 2.4198 10.9511 3.34111L12.0206 6.63291C12.1545 7.04493 12.5385 7.32389 12.9717 7.32389H16.4329C17.4016 7.32389 17.8044 8.56351 17.0207 9.13291L14.2205 11.1674C13.87 11.422 13.7234 11.8734 13.8572 12.2854L14.9268 15.5772C15.2261 16.4985 14.1717 17.2646 13.388 16.6952L10.5878 14.6608C10.2373 14.4061 9.7627 14.4061 9.41221 14.6608L6.61204 16.6952C5.82833 17.2646 4.77385 16.4985 5.0732 15.5772L6.14277 12.2854C6.27665 11.8734 6.12999 11.422 5.7795 11.1674L2.97933 9.13291C2.19562 8.56351 2.59839 7.32389 3.56712 7.32389H7.02832C7.46154 7.32389 7.8455 7.04493 7.97937 6.63291L9.04894 3.34111Z" fill="${color}"/>
</svg>`;
        }
    }
    return output;
}
