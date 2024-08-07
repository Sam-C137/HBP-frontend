/* eslint-disable */
import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Output,
    inject,
} from "@angular/core";

@Directive({
    selector: "[clickOutside]",
    standalone: true,
})
export class ClickOutsideDirective {
    @Output() protected clickOutside = new EventEmitter<MouseEvent>();
    protected elementRef = inject(ElementRef);

    @HostListener("document:click", ["$event"])
    public onClick(event: MouseEvent) {
        if (!this.elementRef) return;
        setTimeout(() => {
            if (!this.elementRef) return;
            const clickedInside = this.elementRef.nativeElement.contains(
                event.target,
            );
            if (!clickedInside) {
                this.clickOutside.emit(event);
            }
        }, 0);
    }
}
