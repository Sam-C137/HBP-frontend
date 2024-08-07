import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "hbp-dashboard-card",
    standalone: true,
    imports: [],
    templateUrl: "./dashboard-card.component.html",
    styleUrl: "./dashboard-card.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCardComponent {
    cardLabel = input.required<
        | "Total Appointments"
        | "Completed Appointments"
        | "Cancelled Appointments"
    >();
    numOfPatients = input.required<number>();
    svgSrc = input.required<string>();
    color = input.required<string>();
}
