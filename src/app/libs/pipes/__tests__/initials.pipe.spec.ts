import { InitialsPipe } from "../initials.pipe";

describe("InitialsPipe", () => {
    it("create an instance", () => {
        const pipe = new InitialsPipe();
        expect(pipe).toBeTruthy();
    });

    it("should return NU when username is undefined", () => {
        const pipe = new InitialsPipe();
        expect(pipe.transform(undefined)).toBe("NU");
    });

    it("should return initials when username is defined", () => {
        const pipe = new InitialsPipe();
        expect(pipe.transform("John Doe")).toBe("JD");
    });
});
