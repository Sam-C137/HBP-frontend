import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DoctorProfilePageComponent } from "../doctor-profile-page/doctor-profile-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppointmentBookingService } from "@/app/services/api/appointment-booking.service";
import { mockDoctorList } from "@/app/utils";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("DoctorProfilePageComponent", () => {
    let component: DoctorProfilePageComponent;
    let fixture: ComponentFixture<DoctorProfilePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DoctorProfilePageComponent,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                {
                    provide: AppointmentBookingService,
                    useValue: {
                        selectedDoctor: () => {
                            return mockDoctorList[0];
                        },
                    },
                },
                provideAngularQuery(new QueryClient()),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorProfilePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a selected doctor", () => {
        expect(component.doctor).toEqual(mockDoctorList[0]);
    });

    it("should have a reviews query", () => {
        expect(component["reviewsQuery"]).toBeTruthy();
    });

    it("should have progress bars in markup", () => {
        const progressBar =
            fixture.nativeElement.querySelector("hbp-progress-bar");
        expect(progressBar).toBeTruthy();
    });
});
