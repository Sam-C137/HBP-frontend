import { CommonModule } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    input,
} from "@angular/core";

@Component({
    selector: "hbp-optimized-image",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./optimized-image.component.html",
    styleUrl: "./optimized-image.component.scss",
})
export class OptimizedImageComponent implements AfterViewInit {
    src = input.required<string>();
    fallback = input.required<string>();
    alt = input<string>("");
    loaded = false;

    @ViewChild("img") img?: ElementRef<HTMLImageElement>;

    ngAfterViewInit() {
        const img = this.img?.nativeElement;
        if (img?.complete) {
            this.loaded = true;
        }
    }

    onLoad() {
        this.loaded = true;
    }
}
