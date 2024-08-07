import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "date",
    standalone: true,
})
export class DatePipe implements PipeTransform {
    transform(date: Date | string | undefined): string {
        if (!date) return "";

        if (typeof date === "string") {
            date = new Date(date);
        }

        const day = date.getDate();
        let suffix = "th";
        if (day === 1 || day === 21 || day === 31) {
            suffix = "st";
        } else if (day === 2 || day === 22) {
            suffix = "nd";
        } else if (day === 3 || day === 23) {
            suffix = "rd";
        }
        const monthNames = [
            "Jan.",
            "Feb.",
            "Mar.",
            "Apr.",
            "May",
            "Jun.",
            "Jul.",
            "Aug.",
            "Sept.",
            "Oct.",
            "Nov.",
            "Dec.",
        ];
        return `${day}${suffix} ${
            monthNames[date.getMonth()]
        } ${date.getFullYear()}`;
    }
}
