import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from "@angular/core";
import { ButtonComponent } from "../button/button.component";

@Component({
    selector: "hbp-error-handler",
    standalone: true,
    imports: [ButtonComponent],
    templateUrl: "./error-handler.component.html",
    styleUrl: "./error-handler.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorHandlerComponent {
    message = input<string | undefined>("Couldn't connect. Please try again");
    retry = output<void>();
}
