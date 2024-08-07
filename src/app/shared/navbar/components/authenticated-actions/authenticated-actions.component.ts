import { Component, model, signal } from "@angular/core";
import { ProfileActionsComponent } from "../profile-actions/profile-actions.component";
import { FloatActions } from "@utils";
import { User } from "@types";
import { NotificationPanelComponent } from "../notification-panel/notification-panel.component";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ClickOutsideDirective } from "@directives";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "hbp-authenticated-actions",
    standalone: true,
    imports: [
        ProfileActionsComponent,
        NotificationPanelComponent,
        ClickOutsideDirective,
        UserAvatarComponent,
        RouterLink,
        CommonModule,
        NgOptimizedImage,
    ],
    templateUrl: "./authenticated-actions.component.html",
    styleUrls: [
        "./authenticated-actions.component.scss",
        "../../../../libs/stylesheets/float.styles.scss",
    ],
})
export class AuthenticatedActionsComponent {
    floatActions = new FloatActions();
    user = model.required<User>();
    newNotification = signal<boolean>(false);
}
