import { popup } from "@/app/libs/animations";
import { HBForm } from "@/app/services";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    inject,
    model,
    signal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TextareaComponent } from "../../inputs/textarea/textarea.component";
import { ButtonComponent } from "../../button/button.component";
import { Doctor, PostReviewDetails } from "@types";
import { UserAvatarComponent } from "../../avatars/user-avatar/user-avatar.component";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { SpinnerComponent } from "../../loaders/spinner/spinner.component";
import { ReviewsService } from "@services/api/review.service";

type DoctorInfo = Pick<Doctor, "fullName" | "id" | "profilePicture">;

@Component({
    selector: "hbp-review-overlay",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TextareaComponent,
        ButtonComponent,
        UserAvatarComponent,
        SpinnerComponent,
    ],
    templateUrl: "./review-overlay.component.html",
    styleUrls: [
        "./review-overlay.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [popup],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReviewOverlayComponent extends HBForm {
    open = model.required<boolean>();
    public selectedDoctor?: DoctorInfo;
    public selectedRating = signal(0);
    private reviewService = inject(ReviewsService);

    constructor() {
        super();
        const { doctor } = history.state as {
            doctor?: DoctorInfo;
        };
        this.selectedDoctor = doctor;
    }

    protected reviewMutation = injectMutation(() => ({
        mutationFn: (review: PostReviewDetails) =>
            this.reviewService.reviewDoctor(review),
        onSuccess: () => {
            this.close();
        },
    }));

    override setupForm() {
        return this.fb.group({
            review: [""],
        });
    }

    public submit() {
        this.reviewMutation.mutate({
            doctorId: this.selectedDoctor!.id,
            rating: this.selectedRating(),
            review: this.form.value.review,
        });
    }

    public close() {
        history.state.doctor = {};
        this.open.set(false);
    }
}
