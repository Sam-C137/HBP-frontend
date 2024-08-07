import { TelPipe } from "../tel.pipe";

describe("TelPipe", () => {
    it("create an instance", () => {
        const pipe = new TelPipe();
        expect(pipe).toBeTruthy();
    });

    it("should not transform when condition is false", () => {
        const pipe = new TelPipe();
        expect(pipe.transform("1234567890", false)).toBe("1234567890");
    });

    it("should transform a phone number", () => {
        const pipe = new TelPipe();
        expect(pipe.transform("1234567890")).toBe("123 456 7890");
    });

    it("should transform phone number with a true condition", () => {
        const pipe = new TelPipe();
        expect(pipe.transform("1234567890", true)).toBe("123 456 7890");
    });
});
