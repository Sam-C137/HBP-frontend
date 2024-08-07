import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    input,
} from "@angular/core";

@Component({
    selector: "hbp-button",
    standalone: true,
    imports: [],
    templateUrl: "./button.component.html",
    styleUrl: "./button.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    type = input<"button" | "submit" | "reset">("button");
    variant = input<"primary" | "secondary" | "tertiary">("primary");
    size = input<"small" | "medium" | "large">("medium");
    disabled = input<boolean | undefined | null>(false);
    loading = input<boolean | undefined | null>(false);
    shadow = input<boolean>(false);
}
