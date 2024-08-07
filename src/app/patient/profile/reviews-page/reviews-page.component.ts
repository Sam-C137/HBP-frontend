import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    signal,
} from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { ReviewsService } from "@services/api/review.service";
import { UserService } from "@services/state";
import { BarsComponent } from "@shared/loaders/bars/bars.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { ReviewComponent } from "@shared/review/review.component";
import { Title } from "@utils";

@Component({
    selector: "hbp-reviews-page",
    standalone: true,
    imports: [BarsComponent, ErrorHandlerComponent, ReviewComponent],
    templateUrl: "./reviews-page.component.html",
    styleUrl: "./reviews-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReviewsPageComponent {
    @Title
    readonly title = "My Reviews";
    private reviewsService = inject(ReviewsService);
    private user = inject(UserService).user;
    currentPage = signal(0);

    protected reviewsQuery = injectQuery(() => ({
        queryKey: ["doctor-reviews", this.currentPage()],
        queryFn: () =>
            this.reviewsService.getReviews(this.user?.id, this.currentPage()),
        staleTime: 1000 * 60,
    }));

    changePage(event: CustomEvent) {
        this.currentPage.set(event.detail - 1);
    }
}
