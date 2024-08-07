import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    contentChild,
    ElementRef,
    HostBinding,
    input,
    TemplateRef,
    viewChild,
    ViewEncapsulation,
} from "@angular/core";
import { TableHeadDirective } from "./table-head.directive";
import { TableRowDirective } from "./table-row.directive";
import { KeyValuePipe, NgTemplateOutlet, TitleCasePipe } from "@angular/common";
import { ReplacePipe } from "@pipes";

@Component({
    selector: "hbp-table",
    standalone: true,
    imports: [KeyValuePipe, NgTemplateOutlet, TitleCasePipe, ReplacePipe],
    templateUrl: "./table.component.html",
    styleUrl: "./table.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TableComponent<TItem extends Record<string, unknown>>
    implements AfterViewInit
{
    data = input.required<TItem[]>();
    headers = contentChild(TableHeadDirective, {
        read: TemplateRef,
    });
    rows = contentChild(TableRowDirective, {
        read: TemplateRef,
    });

    @HostBinding("attr.class")
    get className() {
        return "hbp-table-host";
    }

    tableEl = viewChild<ElementRef<HTMLTableElement>>("table");

    ngAfterViewInit() {
        this.setAria();
    }

    private setAria() {
        const tds = this.tableEl()?.nativeElement.querySelectorAll(
            "td",
        ) as NodeListOf<HTMLTableCellElement>;
        const trs = this.tableEl()?.nativeElement.querySelectorAll(
            "tr",
        ) as NodeListOf<HTMLTableRowElement>;
        tds.forEach((td) => td.setAttribute("role", "cell"));
        trs.forEach((tr) => tr.setAttribute("role", "row"));
    }

    get regexp() {
        return /([a-z])([A-Z])/g;
    }
}
