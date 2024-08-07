import { TestBed } from "@angular/core/testing";
import { servicesListResolver } from "../services-list.resolver";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("servicesListResolver", () => {
    const executeResolver: typeof servicesListResolver = (
        ...resolverParameters
    ) =>
        TestBed.runInInjectionContext(() =>
            servicesListResolver(...resolverParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HttpClientTestingModule],
        });
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should return a list of services", () => {
        // const result = executeResolver();
    });
});
