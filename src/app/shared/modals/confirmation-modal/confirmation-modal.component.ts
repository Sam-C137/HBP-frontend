import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    input,
    output,
} from "@angular/core";
import { ConfirmationDetails } from "./confirmation-modal.service";
import { ButtonComponent } from "@shared/button/button.component";
import { Observable, skip, take } from "rxjs";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";

@Component({
    selector: "hbp-confirmation-modal",
    standalone: true,
    imports: [ButtonComponent, CommonModule, SpinnerComponent],
    templateUrl: "./confirmation-modal.component.html",
    styleUrls: [
        "./confirmation-modal.component.scss",
        "../../../libs/stylesheets/modal.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent implements OnInit {
    details = input<ConfirmationDetails>();
    cancelEvent = output<void>();
    confirmEvent = output<void>();
    loading = input<Observable<boolean>>();

    ngOnInit() {
        this.loading()
            ?.pipe(skip(2), take(1))
            .subscribe(() => this.cancelEvent.emit());
    }

    closeModal() {
        this.loading()
            ?.pipe(take(1))
            .subscribe((value: boolean) => {
                if (!value) {
                    this.cancelEvent.emit();
                }
            });
    }
}
