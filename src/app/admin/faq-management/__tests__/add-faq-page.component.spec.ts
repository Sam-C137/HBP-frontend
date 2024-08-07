import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddFaqPageComponent } from "../add-faq-page/add-faq-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";
import { mockFaqs } from "@/app/utils";

describe("AddFaqPageComponent", () => {
    let component: AddFaqPageComponent;
    let fixture: ComponentFixture<AddFaqPageComponent>;

    beforeEach(async () => {
        Object.defineProperty(window, "history", {
            value: { state: { faq: mockFaqs[0] } },
            writable: true,
        });

        await TestBed.configureTestingModule({
            imports: [
                AddFaqPageComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(AddFaqPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a form for adding a faq", () => {
        expect(component["form"]).toBeTruthy();
    });

    it("should have a form containing question and answer fields", () => {
        expect(component["form"].controls["question"]).toBeTruthy();
        expect(component["form"].controls["answer"]).toBeTruthy();
    });

    it("should have a submit method", () => {
        expect(component["submit"]).toBeTruthy();
    });
});
