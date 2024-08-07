import { TestBed } from "@angular/core/testing";
import { FaqManagementService } from "../faq-management.service";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

describe("FaqManagementService", () => {
    let service: FaqManagementService;

    const mockHTTPClient = {
        post(url: string, body: object) {
            return of(body);
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FaqManagementService,
                { provide: HttpClient, useValue: mockHTTPClient },
            ],
        }).compileComponents();

        service = TestBed.inject(FaqManagementService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
