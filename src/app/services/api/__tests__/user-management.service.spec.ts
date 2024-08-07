import { TestBed } from "@angular/core/testing";
import { UserManagementService } from "../user-management.service";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

describe("UserManagementService", () => {
    let service: UserManagementService;

    const mockHTTPClient = {
        get(url: string) {
            return of(url);
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserManagementService,
                { provide: HttpClient, useValue: mockHTTPClient },
            ],
        }).compileComponents();

        service = TestBed.inject(UserManagementService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should get all users", () => {
        const response = service.getAll({
            search: "test",
            specialization: "test",
        });
        expect(response).toBeTruthy();
    });

    it("should get all users with no params", () => {
        const response = service.getAll({});
        expect(response).toBeTruthy();
    });
});
