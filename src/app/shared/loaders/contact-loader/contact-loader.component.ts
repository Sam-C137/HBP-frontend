import { Component, computed, input } from "@angular/core";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@Component({
    selector: "hbp-contact-loader",
    standalone: true,
    imports: [NgxSkeletonLoaderModule],
    templateUrl: "./contact-loader.component.html",
    styleUrl: "./contact-loader.component.scss",
})
export class ContactLoaderComponent {
    isUpcomingAppointment = input<boolean>(false);
    upperLoaderWidth = input<number>(140);
    lowerLoaderWidth = input<number>(180);

    upperLoaderConfig = computed(() => {
        return {
            width: `${this.upperLoaderWidth()}px`,
            height: "15px",
            "margin-bottom": 0,
        };
    });
    lowerLoaderConfig = computed(() => {
        return {
            width: `${this.lowerLoaderWidth()}px`,
            height: "15px",
            "margin-bottom": 0,
        };
    });
}
