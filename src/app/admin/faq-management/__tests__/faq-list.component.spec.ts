import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FaqListComponent } from "../faq-list/faq-list.component";
import { ComponentRef } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Faq } from "@types";
import { mockFaqs } from "@/app/utils";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("FaqListComponent", () => {
    let component: FaqListComponent;
    let fixture: ComponentFixture<FaqListComponent>;
    let componentRef: ComponentRef<FaqListComponent>;

    const faqs: Faq[] = mockFaqs;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FaqListComponent, HttpClientTestingModule],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(FaqListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("faqs", faqs);
        componentRef.setInput("filters", "published");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have recieved faqs", () => {
        expect(component.faqs()).toEqual(faqs);
    });

    it("should render a list of faq cards", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("hbp-faq-card")).toBeTruthy();
    });
});
