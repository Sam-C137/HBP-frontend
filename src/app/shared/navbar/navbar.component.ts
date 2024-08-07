import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
    AfterViewInit,
    Component,
    inject,
    signal,
    HostBinding,
    input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnInit,
} from "@angular/core";
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from "@angular/router";
import { FloatActions } from "@utils";
import { NavigationListComponent } from "./components/navigation-list/navigation-list.component";
import { UserService } from "@services/state";
import { NotificationPanelComponent } from "./components/notification-panel/notification-panel.component";
import { ProfileActionsComponent } from "./components/profile-actions/profile-actions.component";
import { AuthenticatedActionsComponent } from "./components/authenticated-actions/authenticated-actions.component";

@Component({
    selector: "hbp-navbar",
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        CommonModule,
        NavigationListComponent,
        NotificationPanelComponent,
        ProfileActionsComponent,
        NgOptimizedImage,
        AuthenticatedActionsComponent,
    ],
    templateUrl: "./navbar.component.html",
    styleUrls: [
        "./navbar.component.scss",
        "../../libs/stylesheets/float.styles.scss",
        "../../libs/stylesheets/nav.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit, OnInit {
    router = inject(Router);
    floatActions = new FloatActions();
    userService = inject(UserService);
    user = this.userService.user;
    isDoctor = signal(false);
    position = input<"relative" | "absolute" | "fixed" | "sticky">("relative");

    @HostBinding("style.position") get hostPosition() {
        return this.position();
    }

    ngAfterViewInit() {
        this.doRouteCheck();
        this.checkCurrentUrl();
    }

    private checkCurrentUrl() {
        if (this.router.url.includes("doctor")) {
            this.isDoctor.set(true);
            return;
        }

        this.isDoctor.set(false);
    }

    private doRouteCheck() {
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.checkCurrentUrl();
            }
        });
    }

    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.watchUser();
    }

    watchUser() {
        this.userService.userUpdated$.subscribe((user) => {
            this.user = user!;
            this.cdr.detectChanges();
        });
    }
}
