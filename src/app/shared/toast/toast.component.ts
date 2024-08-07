import { Component, OnDestroy, OnInit, input, output } from "@angular/core";
import { ToastConfig } from "./toast.service";

import { animationDelay } from "./toast.service";
import { SystemGeneric } from "@/app/libs/types";

@Component({
    selector: "hbp-toast",
    standalone: true,
    imports: [],
    templateUrl: "./toast.component.html",
    styleUrl: "./toast.component.scss",
})
export class ToastComponent implements OnInit, OnDestroy {
    config = input<ToastConfig>();
    closeEvent = output<void>();
    closed = false;
    opening = true;

    timeoutIds: Array<SystemGeneric> = [];

    ngOnInit() {
        this.timeoutIds.push(
            setTimeout(() => {
                this.opening = false;
            }, animationDelay),
        );
        document.documentElement.style.setProperty(
            "--toastAnimationDelay",
            animationDelay.toString() + "ms",
        );

        this.autoclose();
    }

    close() {
        this.closed = true;
        this.closeEvent.emit();
    }

    autoclose() {
        this.timeoutIds.push(
            setTimeout(() => {
                this.close();
            }, this.config()?.interval),
        );
    }

    pauseAutoclose() {
        this.timeoutIds.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
    }

    ngOnDestroy() {
        this.timeoutIds.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
    }
}
