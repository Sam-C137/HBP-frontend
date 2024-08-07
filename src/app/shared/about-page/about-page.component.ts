import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Title } from "@utils";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { OptimizedImageComponent } from "@shared/optimized-image/optimized-image.component";
import { FooterComponent } from "@shared/footer/footer.component";
import { AboutPageFormComponent } from "@shared/about-page/about-page-form/about-page-form.component";
import { teamMembers } from "@shared/about-page/about-page.component.data";

@Component({
    selector: "hbp-about-page",
    standalone: true,
    imports: [
        NavbarComponent,
        OptimizedImageComponent,
        FooterComponent,
        AboutPageFormComponent,
    ],
    templateUrl: "./about-page.component.html",
    styleUrl: "./about-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
    @Title
    readonly title = "About Us";
    protected teamMembers = teamMembers;
}
