import { UserService } from "@/app/services/state";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf } from "@angular/common";

@Component({
    selector: "hbp-navigation-list",
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIf],
    templateUrl: "./navigation-list.component.html",
    styleUrl: "./navigation-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListComponent {
    user = inject(UserService).user;
}
