import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarComponent } from "./calendar.component";
import { ComponentRef } from "@angular/core";
import { mockAppointments } from "@/app/utils";

describe("CalendarComponent", () => {
    let component: CalendarComponent;
    let fixture: ComponentFixture<CalendarComponent>;
    let componentRef: ComponentRef<CalendarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("schedule", mockAppointments);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
