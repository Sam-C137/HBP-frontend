import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "time",
    standalone: true,
})
export class TimePipe implements PipeTransform {
    transform(
        time: Date | string | undefined,
        format: 24 | 12 = 12,
        useNext: "next" | "none" = "none",
    ): string {
        if (!time) return "";

        if (typeof time === "string") {
            time = new Date(time);
        }

        const hours = time.getHours();
        const minutes = time.getMinutes();
        const suffix = hours >= 12 ? "PM" : "AM";

        if (format === 12) {
            const displayHours = hours % 12 || 12;

            if (useNext === "next") {
                const nextHours = displayHours + 1;
                return `${displayHours}:${minutes
                    .toString()
                    .padStart(2, "0")} ${suffix} - ${nextHours}:${minutes
                    .toString()
                    .padStart(2, "0")} ${suffix}`;
            } else {
                return `${displayHours}:${minutes
                    .toString()
                    .padStart(2, "0")} ${suffix}`;
            }
        } else {
            if (useNext === "next") {
                const nextHours = hours + 1;
                return `${hours}:${minutes
                    .toString()
                    .padStart(2, "0")} ${suffix} - ${nextHours}:${minutes
                    .toString()
                    .padStart(2, "0")}`;
            } else {
                return `${hours}:${minutes.toString().padStart(2, "0")}`;
            }
        }
    }
}
