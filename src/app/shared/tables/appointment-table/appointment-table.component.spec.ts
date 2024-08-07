import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppointmentTableComponent } from "./appointment-table.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentRef } from "@angular/core";
import { mockAppointments } from "@utils";

describe("AppointmentTableComponent", () => {
    let component: AppointmentTableComponent;
    let fixture: ComponentFixture<AppointmentTableComponent>;
    let componentRef: ComponentRef<AppointmentTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppointmentTableComponent,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentTableComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("items", mockAppointments);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
