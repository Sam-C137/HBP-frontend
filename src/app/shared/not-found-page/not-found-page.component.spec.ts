import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotFoundPageComponent } from "./not-found-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ButtonComponent } from "@shared/button/button.component";
import { RouterLink } from "@angular/router";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { HttpClient } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("NotFoundPageComponent", () => {
    let component: NotFoundPageComponent;
    let fixture: ComponentFixture<NotFoundPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NotFoundPageComponent,
                RouterTestingModule,
                ButtonComponent,
                RouterLink,
                NavbarComponent,
                NoopAnimationsModule,
            ],
            providers: [{ provide: HttpClient, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(NotFoundPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show a 404 animation", () => {
        const compiled = fixture.nativeElement;
        expect(
            compiled.querySelector("[data-testId='animation']"),
        ).toBeTruthy();
    });

    it("should contain a link to the home page", () => {
        const compiled = fixture.nativeElement;
        expect(
            compiled.querySelector("[data-testId='home-link']").textContent,
        ).toContain("Home");
    });
});
