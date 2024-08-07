import { FaqCardComponent } from "../faq-card/faq-card.component";
import { HBConfirmableActions } from "@services";
import { FaqManagementService } from "@services/api/faq-management.service";
import { Confirm } from "@utils";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    output,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import type { Faq } from "@types";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { Router } from "@angular/router";

@Component({
    selector: "hbp-faq-list",
    standalone: true,
    imports: [
        FaqCardComponent,
        ErrorHandlerComponent,
        EmptyListComponent,
        SpinnerComponent,
    ],
    templateUrl: "./faq-list.component.html",
    styleUrl: "./faq-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqListComponent extends HBConfirmableActions {
    private faqManagemantService = inject(FaqManagementService);
    router = inject(Router);
    faqs = input.required<Faq[]>();
    filters = input.required<"PUBLISHED" | "DRAFTED" | "DELETED">();
    isLoading = model(false);
    error = input<string>();
    retry = output<void>();
    override modalLoading = toObservable(
        computed(
            () =>
                this.isLoading() ||
                this.publishFaqMutation.isPending() ||
                this.deleteFaqMutation.isPending() ||
                this.restoreFaqMutation.isPending(),
        ),
    );
    selectedFaq?: Faq;

    publishFaqMutation = injectMutation((client) => ({
        mutationFn: (id: number) => this.faqManagemantService.publish(id),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-faqs"],
            });
        },
    }));

    deleteFaqMutation = injectMutation((client) => ({
        mutationFn: (id: number) => this.faqManagemantService.delete(id),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-faqs"],
            });
        },
    }));

    restoreFaqMutation = injectMutation((client) => ({
        mutationFn: (faq: Faq) => this.faqManagemantService.restore(faq),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["admin-faqs"],
            });
        },
    }));

    async editFaq() {
        await this.router.navigate(["/admin/faqs/create"], {
            state: {
                faq: this.selectedFaq,
            },
        });
    }

    @Confirm({
        title: "Delete FAQ?",
        submit: "Yes, delete",
    })
    deleteFaq() {
        if (!this.selectedFaq) return;
        this.deleteFaqMutation.mutate(this.selectedFaq.id);
    }

    publishFaq() {
        if (!this.selectedFaq) return;
        this.publishFaqMutation.mutate(this.selectedFaq.id);
    }

    restoreFaq() {
        if (!this.selectedFaq) return;
        this.restoreFaqMutation.mutate(this.selectedFaq);
    }
}
