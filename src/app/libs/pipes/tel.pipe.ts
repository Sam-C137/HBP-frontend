import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "tel", standalone: true })
export class TelPipe implements PipeTransform {
    transform(value: string, condition = true): string {
        if (!condition) return value;
        return value.replace(/(\d{3})(\d{3})/, "$1 $2 ");
    }
}
