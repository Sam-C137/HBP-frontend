import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "hbp-footer",
    standalone: true,
    imports: [RouterLink],
    templateUrl: "./footer.component.html",
    styleUrl: "./footer.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}