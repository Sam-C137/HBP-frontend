import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InviteDoctorComponent } from "../invite-doctor/invite-doctor.component";
import { ComponentRef } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("InviteDoctorComponent", () => {
    let component: InviteDoctorComponent;
    let fixture: ComponentFixture<InviteDoctorComponent>;
    let componentRef: ComponentRef<InviteDoctorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                InviteDoctorComponent,
                NoopAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(InviteDoctorComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("open", true);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should be open", () => {
        expect(component.open()).toBe(true);
    });

    it("should have setup a form", () => {
        expect(component["form"]).toBeTruthy();
    });

    it("should add an email to the email list", () => {
        const email = "tim@mail.com";
        component["form"].get("email")?.setValue(email);
        component.addEmail({ key: "Enter" } as KeyboardEvent);
        expect(component.emailList).toContain(email);
    });

    it("should remove an email from the email list", () => {
        const email = "tim@mail.com";
        component.emailList = [email];
        component.removeEmail(email);
        expect(component.emailList).not.toContain(email);
    });
});
