import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SpinnerComponent } from "./spinner.component";

describe("SpinnerComponent", () => {
    let component: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SpinnerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default size", () => {
        expect(component.size()).toEqual("md");
    });
});
