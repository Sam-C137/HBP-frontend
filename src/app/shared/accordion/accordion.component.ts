import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "hbp-accordion",
    standalone: true,
    imports: [],
    templateUrl: "./accordion.component.html",
    styleUrl: "./accordion.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
    label = input.required<string>();
    content = input.required<string>();
    open = false;
}
