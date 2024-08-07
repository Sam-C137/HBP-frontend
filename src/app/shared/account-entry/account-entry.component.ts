import { NavbarComponent } from "@shared/navbar/navbar.component";
import { SidebarComponent } from "@shared/sidebar/sidebar.component";
import { fadeIn } from "@animations";
import { RunOutsideReducedMotion } from "@utils";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Roles } from "@types";
import { UserService } from "@/app/services/state";

@Component({
    selector: "hbp-account-entry",
    standalone: true,
    templateUrl: "./account-entry.component.html",
    styleUrl: "./account-entry.component.scss",
    imports: [SidebarComponent, NavbarComponent, RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn],
})
export class AccountEntryComponent {
    protected Roles = Roles;
    user = inject(UserService).user;

    @RunOutsideReducedMotion
    prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData["animation"]
        );
    }
}
