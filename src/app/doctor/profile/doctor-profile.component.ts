import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { DoctorProfileSidebarComponent } from "./doctor-profile-sidebar/doctor-profile-sidebar.component";
import { fadeIn } from "@animations";
import { RunOutsideReducedMotion } from "@utils";

@Component({
    selector: "hbp-doctor-profile",
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, DoctorProfileSidebarComponent],
    templateUrl: "./doctor-profile.component.html",
    styleUrl: "./doctor-profile.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn],
})
export class DoctorProfileComponent {
    @RunOutsideReducedMotion
    prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData["animation"]
        );
    }
}
