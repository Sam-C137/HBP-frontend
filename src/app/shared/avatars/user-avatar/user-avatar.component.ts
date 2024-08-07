import { OnInit, Component, input, model } from "@angular/core";
import { randomHexColor } from "@utils";
import { InitialsPipe } from "@pipes";

@Component({
    selector: "hbp-user-avatar",
    standalone: true,
    imports: [InitialsPipe],
    templateUrl: "./user-avatar.component.html",
    styleUrl: "./user-avatar.component.scss",
})
export class UserAvatarComponent implements OnInit {
    src = model.required<string | null | undefined>();
    fallback = model.required<string | undefined>();
    size = input<number>();
    color?: string;

    ngOnInit() {
        this.color = randomHexColor();
    }
}
