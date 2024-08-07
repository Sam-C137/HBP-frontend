import { Directive, input } from "@angular/core";

type Obj = Record<string, unknown>;

type TableRowTemplateContext<T extends Obj> = {
    $implicit: T;
};

@Directive({
    selector: "ng-template[hbpTableRow]",
    standalone: true,
})
export class TableRowDirective<K extends Obj> {
    data = input.required<K[]>({
        alias: "hbpTableRow",
    });

    static ngTemplateContextGuard<T extends Obj>(
        dir: TableRowDirective<T>,
        ctx: unknown,
    ): ctx is TableRowTemplateContext<T> {
        return true;
    }
}
