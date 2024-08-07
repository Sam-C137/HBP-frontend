import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from "@angular/core";
import { ClickOutsideDirective } from "@directives";

@Component({
    selector: "hbp-dropdown",
    standalone: true,
    imports: [ClickOutsideDirective],
    templateUrl: "./dropdown.component.html",
    styleUrl: "./dropdown.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
    close = output<void>();
    position = input({ top: 0, left: 0 });
}
