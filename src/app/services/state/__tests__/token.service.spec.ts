import { TestBed } from "@angular/core/testing";
import { TokenService } from "../token.service";

describe("TokenService", () => {
    let service: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TokenService],
        }).compileComponents();

        service = TestBed.inject(TokenService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should have a token serializer", () => {
        const key = service["tokenkey"];
        expect(typeof key).toBe("string");
    });
});
