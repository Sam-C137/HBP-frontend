import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ButtonComponent } from "./button.component";

describe("ButtonComponent", () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default type", () => {
        expect(component.type()).toEqual("button");
    });

    it("should have a default variant", () => {
        expect(component.variant()).toEqual("primary");
    });
});
