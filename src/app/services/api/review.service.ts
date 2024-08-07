import { inject, Injectable } from "@angular/core";
import { HBApiService } from "../hb-api.service";
import { catchError, lastValueFrom } from "rxjs";
import {
    ApiSuccess,
    PageableItems,
    PostReviewDetails,
    Review,
    Summary,
} from "@types";
import { UserService } from "../state";

@Injectable({
    providedIn: "root",
})
export class ReviewsService extends HBApiService {
    user = inject(UserService).user;

    getReviews(userId?: string, page = 1): Promise<PageableItems<Review>> {
        return lastValueFrom(
            this.http
                .get<
                    PageableItems<Review>
                >(`${this.baseUrl}/users/${userId}/reviews`, { params: { page }, ...this.headers })
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    getReviewSummary(userId: string): Promise<Summary> {
        return lastValueFrom(
            this.http
                .get<Summary>(
                    `${this.baseUrl}/users/${userId}/profile`,
                    this.headers,
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    reviewDoctor(review: PostReviewDetails): Promise<ApiSuccess> {
        const id = this.user?.id;

        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.baseUrl}/users/${id}/reviews`,
                    review,
                    this.headers,
                )
                .pipe(catchError((e) => this.onError(e))),
        );
    }
}
