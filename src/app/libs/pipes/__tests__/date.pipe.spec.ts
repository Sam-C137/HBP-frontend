import { DatePipe } from "../date.pipe";

describe("DatePipe", () => {
    it("create an instance", () => {
        const pipe = new DatePipe();
        expect(pipe).toBeTruthy();
    });

    it("should return empty string when date is undefined", () => {
        const pipe = new DatePipe();
        expect(pipe.transform(undefined)).toBe("");
    });

    it("should return formatted date", () => {
        const pipe = new DatePipe();
        expect(pipe.transform(new Date("2021-01-01"))).toBe("1st Jan. 2021");
    });
});
