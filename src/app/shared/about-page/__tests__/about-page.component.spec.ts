import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutPageComponent } from "../about-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("AboutPageComponent", () => {
    let component: AboutPageComponent;
    let fixture: ComponentFixture<AboutPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AboutPageComponent,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AboutPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
