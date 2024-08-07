import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccordionComponent } from "./accordion.component";
import { ComponentRef } from "@angular/core";

describe("AccordionComponent", () => {
    let component: AccordionComponent;
    let fixture: ComponentFixture<AccordionComponent>;
    let componentRef: ComponentRef<AccordionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccordionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("label", "some label");
        componentRef.setInput("content", "some content");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should open and close", async () => {
        const button = fixture.nativeElement.querySelector("button");
        await button.click();
        expect(component.open).toBe(true);
        await button.click();
        expect(component.open).toBe(false);
    });
});
