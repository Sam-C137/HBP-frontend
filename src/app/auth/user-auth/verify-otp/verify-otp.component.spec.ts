import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VerifyOtpComponent } from "./verify-otp.component";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("VerifyOtpComponent", () => {
    let component: VerifyOtpComponent;
    let fixture: ComponentFixture<VerifyOtpComponent>;

    beforeEach(async () => {
        Object.defineProperty(window, "history", {
            value: { state: { email: "tim@mail.com" } },
            writable: true,
        });

        await TestBed.configureTestingModule({
            imports: [VerifyOtpComponent, HttpClientTestingModule],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(VerifyOtpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have recieved an email", () => {
        expect(component.email).toBe("tim@mail.com");
    });

    it("should have a submit method", () => {
        expect(component.submit).toBeDefined();
    });
});
