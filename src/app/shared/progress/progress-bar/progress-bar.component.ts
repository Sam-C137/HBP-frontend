import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "hbp-progress-bar",
    standalone: true,
    imports: [],
    templateUrl: "./progress-bar.component.html",
    styleUrl: "./progress-bar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
    progress = input(0);
}
