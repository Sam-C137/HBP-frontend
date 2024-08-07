import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "hbp-bars",
    standalone: true,
    imports: [],
    templateUrl: "./bars.component.html",
    styleUrl: "./bars.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarsComponent {}
