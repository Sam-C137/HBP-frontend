import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmptyListComponent } from "./empty-list.component";
import { ComponentRef } from "@angular/core";

describe("EmptyListComponent", () => {
    let component: EmptyListComponent;
    let fixture: ComponentFixture<EmptyListComponent>;
    let componentRef: ComponentRef<EmptyListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmptyListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EmptyListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default message", () => {
        expect(component.message()).toBe("No matching items found.");
    });

    it("should render a custom message", () => {
        componentRef.setInput("message", "No items found.");
        fixture.detectChanges();
        const message = fixture.nativeElement.querySelector("p");
        expect(message.textContent).toBe("No items found.");
    });
});
