import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PatientListComponent } from "../patient-list/patient-list.component";
import { ComponentRef } from "@angular/core";
import { Patient } from "@types";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockPatientList } from "@/app/utils";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("PatientListComponent", () => {
    let component: PatientListComponent;
    let fixture: ComponentFixture<PatientListComponent>;
    let componentRef: ComponentRef<PatientListComponent>;
    const patients: Patient[] = mockPatientList;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PatientListComponent, HttpClientTestingModule],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("patients", patients);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have patients", () => {
        expect(component.patients()).toEqual(patients);
    });

    it("should render the crud table", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("hbp-crud-table")).toBeTruthy();
    });
});
