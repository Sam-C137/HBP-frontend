import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    input,
} from "@angular/core";
import { Review } from "@types";
import { DatePipe } from "@angular/common";
import { UserAvatarComponent } from "../avatars/user-avatar/user-avatar.component";

@Component({
    selector: "hbp-review",
    standalone: true,
    imports: [DatePipe, UserAvatarComponent],
    templateUrl: "./review.component.html",
    styleUrl: "./review.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReviewComponent {
    review = input.required<Review>();
    useDoctor = input<boolean>(false);
}
