import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "replace",
    standalone: true,
})
export class ReplacePipe implements PipeTransform {
    transform(
        target: string,
        match: string | RegExp,
        newValue: string,
    ): string {
        return target.replace(new RegExp(match, "g"), newValue.toString());
    }
}
