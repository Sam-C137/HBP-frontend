import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { generateSecondaryColor, lighten, replaceSvgStroke } from "@utils";
import { InitialsPipe } from "@pipes";

@Component({
    selector: "hbp-service-avatar",
    standalone: true,
    imports: [InitialsPipe],
    templateUrl: "./service-avatar.component.html",
    styleUrl: "./service-avatar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceAvatarComponent {
    src = input.required<string | null>();
    fallback = input.required<string>();
    colorCode = input<string>();
    size = input<number>();
    protected replaceStroke = replaceSvgStroke;
    protected lighten = lighten;
    protected generateSecondaryColor = generateSecondaryColor;
}
