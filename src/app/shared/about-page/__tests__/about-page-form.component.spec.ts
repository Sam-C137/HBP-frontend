import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutPageFormComponent } from "../about-page-form/about-page-form.component";

describe("AboutPageFormComponent", () => {
    let component: AboutPageFormComponent;
    let fixture: ComponentFixture<AboutPageFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AboutPageFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AboutPageFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
