import { FilterPipe } from "../filter.pipe";

describe("FilterPipe", () => {
    it("create an instance", () => {
        const pipe = new FilterPipe();
        expect(pipe).toBeTruthy();
    });

    it("should filter by a query", () => {
        const pipe = new FilterPipe();
        const data = ["ball", "cat", "sea"];
        expect(pipe.transform(data, "ba")).toEqual(["ball"]);
    });

    it("should return all items if query is empty", () => {
        const pipe = new FilterPipe();
        const data = ["ball", "cat", "sea"];
        expect(pipe.transform(data, "")).toBe(data);
    });
});
