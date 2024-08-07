import { NavbarComponent } from "@shared/navbar/navbar.component";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { RunOutsideReducedMotion } from "@utils";
import { fadeIn } from "@animations";
import { OptimizedImageComponent } from "@shared/optimized-image/optimized-image.component";

@Component({
    selector: "hbp-auth",
    standalone: true,
    imports: [NavbarComponent, RouterOutlet, OptimizedImageComponent],
    templateUrl: "./user-auth.component.html",
    styleUrl: "./user-auth.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn],
})
export class UserAuthComponent {
    @RunOutsideReducedMotion
    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData;
    }
}
