import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ButtonComponent } from "../../button/button.component";
import { Service } from "@types";
import { ServiceAvatarComponent } from "../../avatars/service-avatar/service-avatar.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "hbp-animated-card",
    standalone: true,
    imports: [ButtonComponent, ServiceAvatarComponent, RouterLink],
    templateUrl: "./animated-card.component.html",
    styleUrl: "./animated-card.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedCardComponent {
    service = input.required<Service>();
}
