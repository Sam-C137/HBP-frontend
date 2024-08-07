import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "initials",
    standalone: true,
})
export class InitialsPipe implements PipeTransform {
    transform(
        name: string | undefined,
        target: "user" | "service" = "user",
    ): unknown {
        if (target === "user") {
            return this.transformUser(name);
        }
        return this.transformService(name);
    }

    transformUser(username: string | undefined): unknown {
        if (!username) {
            return "NU";
        }
        const firstName = username.split(" ")[0];
        const lastName = username.split(" ")[1];

        return `${firstName[0].toUpperCase()}${
            lastName[0].toUpperCase() || ""
        }`;
    }

    transformService(serviceName: string | undefined): unknown {
        if (!serviceName) {
            return "NS";
        }
        return serviceName[0].toUpperCase();
    }
}
