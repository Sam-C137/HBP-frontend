import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FaqCardComponent } from "../faq-card/faq-card.component";
import { ComponentRef } from "@angular/core";
import { Faq } from "@types";
import { mockFaqs } from "@utils";

describe("FaqCardComponent", () => {
    let component: FaqCardComponent;
    let fixture: ComponentFixture<FaqCardComponent>;
    let componentRef: ComponentRef<FaqCardComponent>;

    const faq: Faq = mockFaqs[0];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FaqCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FaqCardComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("faq", faq);
        componentRef.setInput("filters", "published");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have recieved a faq", () => {
        expect(component.faq()).toEqual(faq);
    });

    it("should render a faq card", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("[data-testId='faq-card']")).toBeTruthy();
    });
});
