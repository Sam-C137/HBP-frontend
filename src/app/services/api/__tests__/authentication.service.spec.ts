import { TestBed } from "@angular/core/testing";
import { AuthenticationService } from "../authentication.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Roles } from "@/app/libs/types";

describe("AuthenticationService", () => {
    let service: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthenticationService],
        }).compileComponents();

        service = TestBed.inject(AuthenticationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should log in a user", () => {
        const user = {
            email: "tim@mail.com",
            password: "password",
        };

        const callSpy = spyOn(service, "login").and.callThrough();
        service.login(user);
        expect(callSpy).toHaveBeenCalled();
    });

    it("should sign up a user", () => {
        const user = {
            firstname: "paul",
            lastname: "scholes",
            email: "paul@mail.com",
            password: "manchesterunited",
            confirmPassword: "manchesterunited",
        };

        const callSpy = spyOn(service, "register").and.callThrough();
        service.register(user, Roles.Patient);
        expect(callSpy).toHaveBeenCalled();
    });

    it("should verify request a user password reset", () => {
        const email = "tim@mail.com";

        const callSpy = spyOn(
            service,
            "requestPasswordReset",
        ).and.callThrough();
        service.requestPasswordReset(email);
        expect(callSpy).toHaveBeenCalled();
    });
});
