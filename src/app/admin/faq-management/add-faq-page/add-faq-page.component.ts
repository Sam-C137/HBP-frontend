import { ButtonComponent } from "@shared/button/button.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { FaqManagementService } from "@services/api/faq-management.service";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { type Faq } from "@types";
import { FormValidator } from "@utils";
import { injectMutation } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-add-faq-page",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        TextareaComponent,
        RouterLinkActive,
        RouterLink,
    ],
    templateUrl: "./add-faq-page.component.html",
    styleUrl: "./add-faq-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFaqPageComponent implements OnDestroy {
    faqManagementService = inject(FaqManagementService);
    formBuilder = inject(FormBuilder);
    router = inject(Router);
    form: FormGroup;
    formValidator: FormValidator;
    currentFaq?: Faq;

    constructor() {
        const { faq } = history.state as { faq?: Faq };
        this.currentFaq = faq;
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
    }

    setupForm() {
        return this.formBuilder.group({
            question: [this.currentFaq?.question || "", [Validators.required]],
            answer: [this.currentFaq?.answer || "", Validators.required],
        });
    }

    updateFaqQuery = injectMutation((client) => ({
        mutationFn: (faq: Partial<Faq>) => {
            const { id } = faq;
            delete faq.id;
            return this.faqManagementService.update(faq, id!);
        },
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-faqs"],
            });
            await this.router.navigate(["/admin/faqs"]);
        },
    }));

    publishFaqQuery = injectMutation((client) => ({
        mutationFn: (faq: Faq) => this.faqManagementService.create(faq, true),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-faqs"],
            });
            await this.router.navigate(["/admin/faqs"]);
        },
    }));

    saveAsDraftQuery = injectMutation((client) => ({
        mutationFn: (faq: Faq) => this.faqManagementService.create(faq),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-faqs"],
            });
            await this.router.navigate(["/admin/faqs"]);
        },
    }));

    submit(shouldPublish?: boolean) {
        if (!this.form.valid) return;
        if (this.currentFaq) {
            this.updateFaqQuery.mutate({
                ...this.form.value,
                id: this.currentFaq.id,
            });
        } else {
            if (shouldPublish) {
                this.publishFaqQuery.mutate(this.form.value);
            } else {
                this.saveAsDraftQuery.mutate(this.form.value);
            }
        }
    }

    ngOnDestroy() {
        history.state.faq = {};
    }
}
