import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "hbp-empty-list",
    standalone: true,
    imports: [],
    templateUrl: "./empty-list.component.html",
    styleUrl: "./empty-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyListComponent {
    message = input<string>("No matching items found.");
    imgSrc = input<string>("assets/misc/empty-list.png");
}
