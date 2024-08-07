import {
    AfterViewInit,
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    output,
    signal,
} from "@angular/core";

@Directive({
    selector: "[hbpCollision]",
    standalone: true,
})
export class CollisionDirective implements OnDestroy, AfterViewInit {
    #element = inject(ElementRef);
    hbpCollision = input.required<Element>();

    options: IntersectionObserverInit = {
        root: null,
        threshold: 1,
    };
    observer = new IntersectionObserver(this.callback.bind(this), this.options);
    parentClass = input.required<string>();
    className = signal<string>("");
    classOutput = output<string>();

    constructor() {
        effect(() => {
            this.classOutput.emit(`${this.parentClass()} ${this.className()}`);
        });
    }

    callback(
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
    ) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.className.set("DOWN");
            } else {
                this.className.set("UP");
            }
            observer.unobserve(entry.target);
        });
    }

    ngAfterViewInit(): void {
        this.observer.observe(this.#element.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
        this.#element.nativeElement.setAttribute("class", "no-show");
    }
}
