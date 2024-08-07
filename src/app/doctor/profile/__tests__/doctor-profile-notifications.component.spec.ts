import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DoctorProfileNotificationsComponent } from "../doctor-profile-notifications/doctor-profile-notifications.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";

describe("DoctorProfileNotificationsComponent", () => {
    let component: DoctorProfileNotificationsComponent;
    let fixture: ComponentFixture<DoctorProfileNotificationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DoctorProfileNotificationsComponent,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorProfileNotificationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
