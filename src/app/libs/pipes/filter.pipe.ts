import { Pipe, PipeTransform } from "@angular/core";
import { SystemGeneric } from "../types";

@Pipe({
    name: "filter",
    standalone: true,
})
export class FilterPipe implements PipeTransform {
    transform<T extends Array<SystemGeneric> | undefined>(
        data: T,
        query: string,
        key?: string,
    ) {
        if (!data) {
            return [];
        }
        if (query === "" || data.length === 0) {
            return data;
        } else {
            return data.filter((current) => {
                return key
                    ? current[key]
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase())
                    : current
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase());
            });
        }
    }
}
