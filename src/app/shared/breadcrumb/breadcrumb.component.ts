import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Breadcrumb } from "./breadcrumb.types";
import { CommonModule } from "@angular/common";

@Component({
    selector: "hbp-breadcrumb",
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule],
    templateUrl: "./breadcrumb.component.html",
    styleUrl: "./breadcrumb.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
    #router = inject(Router);

    breadcrumbs = input<Breadcrumb[]>([]);
    homeRoot = input("/patient");

    navigateTo(route: string, params: Record<string, string> | undefined) {
        this.#router.navigate([route], { queryParams: params });
    }
}
