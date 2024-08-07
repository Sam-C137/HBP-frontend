import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GeneralPageComponent } from "../general-page/general-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("GeneralPageComponent", () => {
    let component: GeneralPageComponent;
    let fixture: ComponentFixture<GeneralPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                GeneralPageComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a form matching all profile details", () => {
        const keys = Object.keys(component["form"].value);

        const expected = [
            "fullName",
            "email",
            "gender",
            "contact",
            "address",
            "profilePicture",
            "emergencyName",
            "emergencyPhoneNumber",
            "emergencyRelationship",
            "emergencyEmail",
            "emergencyLocation",
        ];

        expect(keys).toEqual(expected);
    });

    it("should have a submit method", () => {
        expect(component.submit).toBeDefined();
    });

    it("should have called setupForm on init", () => {
        const setupFormSpy = spyOn(component, "setupForm" as keyof unknown);
        component.ngOnInit();
        expect(setupFormSpy).toHaveBeenCalled();
    });
});
