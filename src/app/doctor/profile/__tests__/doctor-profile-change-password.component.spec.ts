import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DoctorProfileChangePasswordFormComponent } from "../doctor-profile-change-password/doctor-profile-change-password.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";

describe("DoctorProfileChangePasswordComponent", () => {
    let component: DoctorProfileChangePasswordFormComponent;
    let fixture: ComponentFixture<DoctorProfileChangePasswordFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DoctorProfileChangePasswordFormComponent,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(
            DoctorProfileChangePasswordFormComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
