import {
    ElementRef,
    Directive,
    AfterViewInit,
    OnDestroy,
    output,
    input,
} from "@angular/core";
import { Subject, debounceTime, filter } from "rxjs";

@Directive({
    selector: "[hbpIntersectionObserver]",
    exportAs: "intersection",
    standalone: true,
})
export class IntersectionObserverDirective implements AfterViewInit, OnDestroy {
    public intersectionEmitted = output<boolean>();
    public isInterSecting: boolean;
    public debounce = input<number>(300);

    private intersectionSubject = new Subject<IntersectionObserverEntry>();

    private elementRef: ElementRef;
    private observer: IntersectionObserver | null = null;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
        this.observer = null;
        this.isInterSecting = false;
    }

    public ngAfterViewInit() {
        this.intersectionSubject
            .pipe(
                debounceTime(this.debounce()),
                filter((entry) => entry.isIntersecting),
            )
            .subscribe((entry) => {
                this.intersectionEmitted.emit(entry.isIntersecting);
            });

        this.observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                this.isInterSecting = entries[0].isIntersecting;
                this.intersectionSubject.next(entries[0]);
            },
            { threshold: 0.1 },
        );
        this.observer.observe(this.elementRef.nativeElement);
    }

    public ngOnDestroy() {
        this.observer?.disconnect();
        this.observer = null;
        this.intersectionSubject.unsubscribe();
    }
}
