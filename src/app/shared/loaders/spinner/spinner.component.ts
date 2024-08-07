import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    input,
} from "@angular/core";

@Component({
    selector: "hbp-spinner",
    standalone: true,
    imports: [],
    templateUrl: "./spinner.component.html",
    styleUrl: "./spinner.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit, OnDestroy {
    size = input<"sm" | "md" | "lg" | "xl" | "screen">("md");

    ngOnInit() {
        if (this.size() === "screen") {
            document.body.style.overflow = "hidden";
        }
    }

    ngOnDestroy() {
        if (this.size() === "screen") {
            document.body.style.overflow = "auto";
        }
    }
}
