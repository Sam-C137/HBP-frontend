import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { Component, inject, model } from "@angular/core";
import { RouterLink } from "@angular/router";
import { User } from "@types";
import { UserService } from "@/app/services/state";
import { NgIf } from "@angular/common";
import { injectQueryClient } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-profile-actions",
    standalone: true,
    imports: [RouterLink, UserAvatarComponent, NgIf],
    templateUrl: "./profile-actions.component.html",
    styleUrl: "./profile-actions.component.scss",
})
export class ProfileActionsComponent {
    user = model.required<User>();
    userService = inject(UserService);
    queryClient = injectQueryClient();

    logout() {
        this.userService.removeUser();
        this.queryClient.invalidateQueries();
    }
}
