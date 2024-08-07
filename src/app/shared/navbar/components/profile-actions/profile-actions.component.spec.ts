import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ProfileActionsComponent } from "./profile-actions.component";
import { User } from "@types";
import { UserService } from "@services/state";
import { mockDoctorList } from "@/app/utils/mockdata";
import { ComponentRef } from "@angular/core";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";

describe("ProfileActionsComponent", () => {
    let component: ProfileActionsComponent;
    let fixture: ComponentFixture<ProfileActionsComponent>;
    let componentRef: ComponentRef<ProfileActionsComponent>;

    const mockUserService: Record<"user", User> = {
        user: mockDoctorList[0],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileActionsComponent, RouterTestingModule],
            providers: [
                { provide: UserService, useValue: mockUserService },
                provideAngularQuery(new QueryClient()),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileActionsComponent);
        TestBed.inject(UserService);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;

        componentRef.setInput("user", mockDoctorList[0] as User);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show a user's email and full name", () => {
        const emailElement = fixture.nativeElement.querySelector(
            "[data-testId='email']",
        );
        const nameElement = fixture.nativeElement.querySelector(
            "[data-testId='username']",
        );

        expect(emailElement.textContent).toContain(mockDoctorList[0].email);
        expect(nameElement.textContent).toContain(mockDoctorList[0].fullName);
    });
});
