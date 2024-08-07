import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    output,
} from "@angular/core";
import { Faq } from "@types";

@Component({
    selector: "hbp-faq-card",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./faq-card.component.html",
    styleUrl: "./faq-card.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqCardComponent {
    faq = input.required<Faq>();
    edit = output<void>();
    delete = output<void>();
    publish = output<void>();
    restore = output<void>();
    selectedFaq = model<Faq>();
    filters = input.required<"PUBLISHED" | "DRAFTED" | "DELETED">();

    toggleFaqStatus(
        currentAction: ReturnType<typeof this.filters> | "RESTORE",
    ): void {
        this.selectedFaq.set(this.faq());
        switch (currentAction) {
            case "PUBLISHED":
                this.publish.emit();
                break;
            case "DRAFTED":
                this.edit.emit();
                break;
            case "DELETED":
                this.delete.emit();
                break;
            case "RESTORE":
                this.restore.emit();
                break;
            default:
                break;
        }
    }
}
