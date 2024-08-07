import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { OptimizedImageComponent } from "@shared/optimized-image/optimized-image.component";
import { Title } from "@utils";

@Component({
    selector: "hbp-doctor-auth",
    standalone: true,
    imports: [NavbarComponent, RouterOutlet, OptimizedImageComponent],
    templateUrl: "./doctor-auth.component.html",
    styleUrl: "./doctor-auth.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorAuthComponent {
    @Title
    readonly title = "Doctor";
}
