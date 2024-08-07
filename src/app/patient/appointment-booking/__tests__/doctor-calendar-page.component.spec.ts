import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DoctorCalendarPageComponent } from "../doctor-calendar-page/doctor-calendar-page.component";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("DoctorCalendarPageComponent", () => {
    let component: DoctorCalendarPageComponent;
    let fixture: ComponentFixture<DoctorCalendarPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DoctorCalendarPageComponent,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorCalendarPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
