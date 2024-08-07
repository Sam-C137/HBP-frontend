import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppointmentsPageComponent } from "../appointments-page/appointments-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("AppointmentsPageComponent", () => {
    let component: AppointmentsPageComponent;
    let fixture: ComponentFixture<AppointmentsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppointmentsPageComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
