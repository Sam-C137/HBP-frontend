import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SignUpComponent } from "./sign-up.component";
import { HttpClient } from "@angular/common/http";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("SignUpComponent", () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;

    const mockHttpClient = {
        post: () => {},
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignUpComponent, RouterTestingModule],
            providers: [
                { provide: HttpClient, useValue: mockHttpClient },
                provideAngularQuery(new QueryClient()),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a register mutation", () => {
        expect(component.registerMutation).toBeDefined();
    });

    it("should have a setup form method", () => {
        expect(component.setupForm).toBeDefined();
    });

    it("should have a submit method", () => {
        expect(component.submit).toBeDefined();
    });
});
