import {
    Component,
    ChangeDetectionStrategy,
    signal,
    inject,
    AfterViewInit,
} from "@angular/core";
import { fadeIn } from "@animations";
import { RunOutsideReducedMotion } from "@utils";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { FooterComponent } from "@shared/footer/footer.component";
import { ProfileSidebarComponent } from "./profile-sidebar/profile-sidebar.component";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { TitleCasePipe } from "@angular/common";
import { ReplacePipe } from "@pipes";

@Component({
    selector: "hbp-patient-profile-entry",
    standalone: true,
    templateUrl: "./profile.entry.component.html",
    styleUrl: "./profile.entry.component.scss",
    imports: [
        NavbarComponent,
        RouterOutlet,
        FooterComponent,
        ProfileSidebarComponent,
        BreadcrumbComponent,
        TitleCasePipe,
        ReplacePipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn],
})
export class PatientProfileEntryComponent implements AfterViewInit {
    private router = inject(Router);
    currentRoute = signal("");

    ngAfterViewInit() {
        this.doRouteCheck();
        this.checkCurrentUrl();
    }

    private checkCurrentUrl() {
        const url = this.router.url.split("/");
        this.currentRoute.set(url[url.length - 1]);
    }

    private doRouteCheck() {
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.checkCurrentUrl();
            }
        });
    }

    @RunOutsideReducedMotion
    prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData["animation"]
        );
    }
}
