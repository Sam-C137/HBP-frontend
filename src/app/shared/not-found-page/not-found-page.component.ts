import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "@shared/button/button.component";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { HBPage } from "@services";

@Component({
    selector: "hbp-not-found-page",
    standalone: true,
    imports: [ButtonComponent, RouterLink, NavbarComponent],
    templateUrl: "./not-found-page.component.html",
    styleUrl: "./not-found-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent extends HBPage {
    override title = "Page Not Found";
}
