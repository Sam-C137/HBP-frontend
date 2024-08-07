import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
import { ReviewComponent } from "@shared/review/review.component";
import { ProgressBarComponent } from "@shared/progress/progress-bar/progress-bar.component";
import { listStagger } from "@animations";
import { ReviewsService } from "@/app/services/api/review.service";
import { BarsComponent } from "@/app/shared/loaders/bars/bars.component";
import {
    injectQuery,
    keepPreviousData,
} from "@tanstack/angular-query-experimental";
import { UserService } from "@/app/services/state";

@Component({
    selector: "hbp-reviews",
    standalone: true,
    imports: [ReviewComponent, ProgressBarComponent, BarsComponent],
    templateUrl: "./reviews.component.html",
    styleUrl: "./reviews.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    animations: [listStagger],
})
export class ReviewsComponent {
    #reviewsService = inject(ReviewsService);
    private doctor = inject(UserService).user;
    public currentPage = signal(0);
    protected reviewsQuery = injectQuery(() => ({
        queryKey: ["doctor-reviews", this.currentPage()],
        queryFn: () =>
            this.#reviewsService.getReviews(
                this.doctor?.id,
                this.currentPage(),
            ),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    }));
    protected summaryQuery = injectQuery(() => ({
        queryKey: ["review-summary"],
        queryFn: () =>
            this.#reviewsService.getReviewSummary(this.doctor?.id || ""),
        staleTime: 1000 * 60,
    }));

    calculatePercentage(numOfReviews: number, totalReviews: number) {
        const reviewPercent = (numOfReviews / totalReviews) * 100;
        return reviewPercent || 0;
    }

    changePage(newPage: CustomEvent) {
        if (this.reviewsQuery.isPending()) return;
        this.currentPage.set(newPage.detail);
    }
}
