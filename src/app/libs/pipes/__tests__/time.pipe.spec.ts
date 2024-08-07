import { TimePipe } from "../time.pipe";

describe("TimePipe", () => {
    it("create an instance", () => {
        const pipe = new TimePipe();
        expect(pipe).toBeTruthy();
    });

    it("should return empty string when time is undefined", () => {
        const pipe = new TimePipe();
        expect(pipe.transform(undefined)).toBe("");
    });

    it("should return formatted time", () => {
        const pipe = new TimePipe();
        expect(pipe.transform(new Date("2021-01-01T12:00:00"), 12)).toBe(
            "12:00 PM",
        );
    });

    it("should return formatted time in 24 hours format", () => {
        const pipe = new TimePipe();
        expect(pipe.transform(new Date("2021-01-01T12:00:00"), 24)).toBe(
            "12:00",
        );
    });
});
