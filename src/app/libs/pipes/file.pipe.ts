import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "file",
    standalone: true,
})
export class FilenamePipe implements PipeTransform {
    transform(
        value: string | undefined,
        output: "icon" | "text" | "ext" = "text",
    ): string {
        if (!value) return "";

        if (output === "text") {
            return value.split("/").pop() || "";
        } else if (output === "ext") {
            return value.split(".").pop() || "";
        } else {
            const ext = value.split(".").pop();
            return `assets/icons/${ext}-file-icon.svg`;
        }
    }
}
