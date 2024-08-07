import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { slider } from "@animations";
import { RunOutsideReducedMotion } from "@utils";

@Component({
    selector: "hbp-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    animations: [slider],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    @RunOutsideReducedMotion
    prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData["animation"]
        );
    }
}
