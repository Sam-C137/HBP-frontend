import { ReplacePipe } from "../replace.pipe";

describe("ReplacePipe", () => {
    it("create an instance", () => {
        const pipe = new ReplacePipe();
        expect(pipe).toBeTruthy();
    });

    it("should replace all occurrences of a string", () => {
        const pipe = new ReplacePipe();
        expect(pipe.transform("John Doe", "o", "a")).toBe("Jahn Dae");
    });

    it("should replace all occurrences of a string with a symbol", () => {
        const pipe = new ReplacePipe();
        expect(pipe.transform("John Doe", "o", "*")).toBe("J*hn D*e");
    });

    it("should replace all occurrences of a regular expression with a string", () => {
        const pipe = new ReplacePipe();
        expect(pipe.transform("John Doe", /o/g, "a")).toBe("Jahn Dae");
    });
});
