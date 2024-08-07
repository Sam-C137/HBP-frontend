import { Directive, input } from "@angular/core";

type Obj = Record<string, unknown>;

type TableHeaderTemplateContext<T extends Obj> = {
    $implicit: T[];
};

@Directive({
    selector: "ng-template[hbpTableHead]",
    standalone: true,
})
export class TableHeadDirective<K extends Obj> {
    data = input.required<K[]>({
        alias: "hbpTableHead",
    });

    static ngTemplateContextGuard<T extends Obj>(
        dir: TableHeadDirective<T>,
        ctx: unknown,
    ): ctx is TableHeaderTemplateContext<T> {
        return true;
    }
}
