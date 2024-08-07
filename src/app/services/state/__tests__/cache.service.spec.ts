import { TestBed } from "@angular/core/testing";
import { CacheService } from "../cache.service";

describe("CacheService", () => {
    let service: CacheService<number>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CacheService],
        }).compileComponents();

        service = TestBed.inject(CacheService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be able to cache some data", () => {
        service.set("number", 1);
        expect(service.get("number")).toBe(1);
    });

    it("should be able to delete from cache", () => {
        service.set("number", 1);
        service.delete("number");
        expect(service.get("number")).toBe(undefined);
    });

    it("should be able to lookup the cache", () => {
        service.set("number", 1);
        expect(service.has("number")).toBe(true);
    });
});
