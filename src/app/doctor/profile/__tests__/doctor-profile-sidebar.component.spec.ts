import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DoctorProfileSidebarComponent } from "../doctor-profile-sidebar/doctor-profile-sidebar.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";

describe("DoctorProfileSidebarComponent", () => {
    let component: DoctorProfileSidebarComponent;
    let fixture: ComponentFixture<DoctorProfileSidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DoctorProfileSidebarComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorProfileSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
