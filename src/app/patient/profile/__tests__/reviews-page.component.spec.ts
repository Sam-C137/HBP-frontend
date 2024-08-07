import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReviewsPageComponent } from "../reviews-page/reviews-page.component";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ReviewsPageComponent", () => {
    let component: ReviewsPageComponent;
    let fixture: ComponentFixture<ReviewsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReviewsPageComponent, HttpClientTestingModule],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(ReviewsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
