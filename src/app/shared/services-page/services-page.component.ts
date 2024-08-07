import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    QueryList,
    ViewChildren,
} from "@angular/core";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { ServiceAvatarComponent } from "../avatars/service-avatar/service-avatar.component";
import { ButtonComponent } from "../button/button.component";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { SpinnerComponent } from "../loaders/spinner/spinner.component";
import { ServiceManagementService } from "@services/api/service-management.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "hbp-services-page",
    standalone: true,
    imports: [
        NavbarComponent,
        FooterComponent,
        ServiceAvatarComponent,
        ButtonComponent,
        SpinnerComponent,
    ],
    templateUrl: "./services-page.component.html",
    styleUrl: "./services-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements AfterViewInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private serviceManager = inject(ServiceManagementService);
    protected services = injectQuery(() => ({
        queryKey: ["landing-page-services"],
        queryFn: () => this.serviceManager.getAll({ status: "active" }),
        retry: 2,
    }));

    @ViewChildren("serviceItem")
    private serviceItems?: QueryList<ElementRef<HTMLDivElement>>;

    ngAfterViewInit() {
        if (this.serviceItems && this.serviceItems.length > 0) {
            this.router.navigate([], {
                fragment: this.route.snapshot.queryParams["info"],
                queryParamsHandling: "merge",
            });
            this.handleScroll(this.route.snapshot.queryParams["info"]);
            return;
        }
        const observer = new MutationObserver(() => {
            if (this.serviceItems && this.serviceItems.length > 0) {
                this.handleScroll(this.route.snapshot.queryParams["info"]);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    private handleScroll(itemId: string) {
        if (!this.serviceItems) return;
        const itemToscrollTo = this.serviceItems.find(
            (item) => item.nativeElement.id === itemId,
        );
        if (itemToscrollTo) {
            itemToscrollTo.nativeElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }
}
