import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "hbp-testimony-card",
    standalone: true,
    imports: [],
    templateUrl: "./testimony-card.component.html",
    styleUrl: "./testimony-card.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyCardComponent {
    imgUrl = input.required<string>();
    author = input.required<string>();
    content = input.required<string>();
    role = input.required<string>();
}
