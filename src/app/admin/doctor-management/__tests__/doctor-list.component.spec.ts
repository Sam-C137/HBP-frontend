import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DoctorListComponent } from "..//doctor-list/doctor-list.component";
import { ComponentRef } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockDoctorList } from "@/app/utils";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("DoctorListComponent", () => {
    let component: DoctorListComponent;
    let fixture: ComponentFixture<DoctorListComponent>;
    let componentRef: ComponentRef<DoctorListComponent>;

    const doctors = mockDoctorList;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DoctorListComponent, HttpClientTestingModule],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("doctors", doctors);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should receive doctors", () => {
        expect(component.doctors()).toEqual(doctors);
    });

    it("should activate a doctor", () => {
        component.selectedDoctor = doctors[0];
        component.activateDoctor();
        expect(component.isLoading()).toBeFalse();
    });

    it("should show an empty list if no doctors are available", () => {
        componentRef.setInput("doctors", []);
        componentRef.setInput("isLoading", false);
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector("hbp-empty-list"),
        ).toBeTruthy();
    });
});
