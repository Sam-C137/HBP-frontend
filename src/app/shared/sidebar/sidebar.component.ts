import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { doctorNavigationList, navigationList } from "./data.static";
import { Roles } from "@types";

@Component({
    selector: "hbp-sidebar",
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: "./sidebar.component.html",
    styleUrl: "./sidebar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    private sanitizer = inject(DomSanitizer);
    role = input<Roles | undefined>(undefined);
    navigationList = computed(() =>
        this.role() == Roles.Admin ? navigationList : doctorNavigationList,
    );
    baseRoot = computed(() =>
        this.role() == Roles.Admin ? "/admin" : "/doctor",
    );
    position = input<"relative" | "absolute" | "fixed">("relative");

    renderIcon(icon: string) {
        return this.sanitizer.bypassSecurityTrustHtml(icon);
    }
}
