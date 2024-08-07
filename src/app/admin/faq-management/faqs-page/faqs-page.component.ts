import { FormValidator, Title } from "@utils";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    effect,
    inject,
    signal,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ButtonComponent } from "@shared/button/button.component";
import { RouterLink } from "@angular/router";
import { FaqListComponent } from "../faq-list/faq-list.component";
import { SelectValueAccessorDirective } from "@directives";
import { FaqManagementService } from "@services/api/faq-management.service";
import { skip } from "rxjs";
import { removeFalsyValues } from "@/app/utils";
import { CommonModule } from "@angular/common";
import {
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-faqs-page",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        RouterLink,
        FaqListComponent,
        SelectValueAccessorDirective,
        CommonModule,
    ],
    templateUrl: "./faqs-page.component.html",
    styleUrl: "./faqs-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FaqsPageComponent implements OnInit {
    @Title
    title = "Frequently Asked Questions";
    faqManagementService = inject(FaqManagementService);
    currentPage = signal(0);
    formBuilder = inject(FormBuilder);
    form: FormGroup;
    formValidator: FormValidator;
    queryClient = injectQueryClient();

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        effect(this.prefetch);
    }

    setupForm() {
        return this.formBuilder.group({
            search: [""],
            state: [""],
        });
    }

    ngOnInit() {
        this.handleSearch();
    }

    faqsQuery = injectQuery(() => ({
        queryKey: ["admin-faqs", this.currentPage(), this.form.value],
        queryFn: () =>
            this.faqManagementService.getAll(
                removeFalsyValues({
                    ...this.form.value,
                    page: this.currentPage(),
                }),
            ),
    }));

    handleSearch() {
        this.form.valueChanges.pipe(skip(1)).subscribe(() => {
            this.faqsQuery.refetch();
        });
    }

    changePage(event: CustomEvent) {
        if (this.faqsQuery.isPending()) return;
        this.currentPage.set(event.detail - 1);
    }

    prefetch = () => {
        if (!this.faqsQuery.isPlaceholderData() && this.faqsQuery.data()) {
            this.queryClient.prefetchQuery({
                queryKey: [
                    "admin-faqs",
                    this.currentPage() + 1,
                    this.form.value,
                ],
                queryFn: () =>
                    this.faqManagementService.getAll(
                        removeFalsyValues({
                            ...this.form.value,
                            page: this.currentPage() + 1,
                        }),
                    ),
            });
        }
    };
}
