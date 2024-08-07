import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from "@angular/core";
import { NavbarComponent } from "@shared/navbar/navbar.component";
import { AnimatedCardComponent } from "@shared/cards/animated-card/animated-card.component";
import { testimonies } from "./data.static";
import { CtaFormComponent } from "./components/cta-form/cta-form.component";
import { FooterComponent } from "@shared/footer/footer.component";
import { ButtonComponent } from "@shared/button/button.component";
import { OptimizedImageComponent } from "@shared/optimized-image/optimized-image.component";
import { TestimonyCardComponent } from "@shared/cards/testimony-card/testimony-card.component";
import { AccordionComponent } from "@shared/accordion/accordion.component";
import { RunOutsideReducedMotion, Title } from "@utils";
import { PageableItems, Service } from "@/app/libs/types";
import { SpinnerComponent } from "../loaders/spinner/spinner.component";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { HttpClient } from "@angular/common/http";
import { interval, lastValueFrom, tap } from "rxjs";
import { environment } from "@/environments/environment.development";
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UserService } from "@services/state";
import { FaqManagementService } from "@services/api/faq-management.service";
import { NgIf } from "@angular/common";

@Component({
    selector: "hbp-landing-page",
    standalone: true,
    templateUrl: "./landing-page.component.html",
    styleUrls: [
        "./landing-page.component.scss",
        "./stylesheets/hero.styles.scss",
        "./stylesheets/recommendation.styles.scss",
        "./stylesheets/services.styles.scss",
        "./stylesheets/testimonies.styles.scss",
        "./stylesheets/cta&faq.styles.scss",
    ],
    imports: [
        NavbarComponent,
        AnimatedCardComponent,
        CtaFormComponent,
        FooterComponent,
        ButtonComponent,
        OptimizedImageComponent,
        TestimonyCardComponent,
        AccordionComponent,
        ButtonComponent,
        SpinnerComponent,
        RouterLink,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnInit {
    @Title
    readonly title = "Home";
    protected testimonies = testimonies;
    protected user = inject(UserService).user;
    private cdr = inject(ChangeDetectorRef);
    private destroyer = inject(DestroyRef);
    @ViewChild("animatedText", { static: false })
    animatedText?: ElementRef<HTMLSpanElement>;

    texts: string[] = ["Specialist", "Dentist", "OB-GYNs", "Dermatologist"];
    currentText: string = this.texts[0];

    ngOnInit() {
        this.animateText();
    }

    private animateText() {
        this.updateText();
        interval(4000)
            .pipe(
                tap(() => this.updateText()),
                takeUntilDestroyed(this.destroyer),
            )
            .subscribe();
    }

    @RunOutsideReducedMotion
    updateText() {
        this.currentText =
            this.texts[Math.floor(Math.random() * this.texts.length)];
        document.documentElement.style.setProperty(
            "--typewriterCharacters",
            this.currentText.length.toString(),
        );

        const span = this.animatedText?.nativeElement;
        if (span) {
            span.classList.remove("typewriter");
            void span.offsetWidth;
            span.classList.add("typewriter");
        }
        this.cdr.detectChanges();
    }

    @ViewChild("reel") reel?: ElementRef;
    scrollPosition = 0;
    atScrollStart = true;
    atScrollEnd = false;
    currentIndex = 0;

    scrollLeft() {
        const itemWidth = this.reel?.nativeElement.firstChild.offsetWidth;
        this.scrollPosition = Math.max(this.scrollPosition - itemWidth, 0);
        this.reel?.nativeElement.scrollTo({
            left: this.scrollPosition,
            behavior: "smooth",
        });
        this.atScrollStart = this.scrollPosition === 0;
        this.atScrollEnd = false;
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }

    scrollRight() {
        const itemWidth = this.reel?.nativeElement.firstChild.offsetWidth;
        const maxScroll =
            this.reel?.nativeElement.scrollWidth -
            this.reel?.nativeElement.clientWidth;
        this.scrollPosition = Math.min(
            this.scrollPosition + itemWidth,
            maxScroll,
        );
        this.reel?.nativeElement.scrollTo({
            left: this.scrollPosition,
            behavior: "smooth",
        });
        this.atScrollEnd = this.scrollPosition === maxScroll;
        this.atScrollStart = false;
        this.currentIndex = Math.min(
            this.currentIndex + 1,
            this.testimonies.length - 1,
        );
    }

    scrollToIndex(index: number) {
        const itemWidth = this.reel?.nativeElement.firstChild.offsetWidth;
        this.scrollPosition = index * itemWidth;
        this.reel?.nativeElement.scrollTo({
            left: this.scrollPosition,
            behavior: "smooth",
        });
        this.currentIndex = index;
        this.atScrollStart = this.currentIndex === 0;
        this.atScrollEnd = this.currentIndex === this.testimonies.length - 1;
    }

    http = inject(HttpClient);
    services = injectQuery(() => ({
        queryKey: ["landing-page-services"],
        queryFn: () =>
            lastValueFrom(
                this.http.get<PageableItems<Service>>(
                    `${environment.baseUrl}/services`,
                    {
                        headers: {
                            "Skip-Interceptor": "true",
                            "ngrok-skip-browser-warning":
                                "skip-browser-warning",
                        },
                    },
                ),
            ),
        retry: 2,
    }));
    faqService = inject(FaqManagementService);
    faqQuery = injectQuery(() => ({
        queryKey: ["faq"],
        queryFn: () => this.faqService.getAll({ state: "PUBLISHED" }),
    }));
}
