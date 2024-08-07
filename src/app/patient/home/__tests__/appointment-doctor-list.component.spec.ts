import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppointmentDoctorListComponent } from "../appointment-doctor-list/appointment-doctor-list.component";
import { ComponentRef } from "@angular/core";
import { Doctor } from "@types";
import { RouterTestingModule } from "@angular/router/testing";
import { mockDoctorList } from "@/app/utils";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AppointmentDoctorListComponent", () => {
    let component: AppointmentDoctorListComponent;
    let fixture: ComponentFixture<AppointmentDoctorListComponent>;
    let componentRef: ComponentRef<AppointmentDoctorListComponent>;

    const doctors: Doctor[] = mockDoctorList;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppointmentDoctorListComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentDoctorListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("doctors", doctors);
        componentRef.setInput("loading", false);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render a doctor list", () => {
        const list = fixture.nativeElement.querySelector(".doctor-list");
        expect(list).toBeTruthy();
    });

    it("should have recieved a list of doctors", () => {
        expect(component.doctors()).toBe(doctors);
    });

    it("should have a navigate method", () => {
        expect(component.navigate).toBeDefined();
    });
});
