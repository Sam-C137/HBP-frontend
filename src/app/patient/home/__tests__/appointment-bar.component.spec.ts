import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppointmentBarComponent } from "../appointment-bar/appointment-bar.component";
import { ComponentRef } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { mockServicesList } from "@/app/utils";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AppointmentBarComponent", () => {
    let component: AppointmentBarComponent;
    let fixture: ComponentFixture<AppointmentBarComponent>;
    let componentRef: ComponentRef<AppointmentBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppointmentBarComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentBarComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("specializations", mockServicesList);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a form group with date, location and specialization", () => {
        const controls = Object.keys(component["form"].value);

        expect(controls).toEqual(["location", "date", "specialization"]);
    });

    it("should have a submit method", () => {
        expect(component.submit).toBeDefined();
    });

    it("should have a method for getting the user's location", () => {
        expect(component.useUserLocation).toBeDefined();
    });
});
