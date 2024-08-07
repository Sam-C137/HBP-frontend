import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { HBForm } from "@services";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ButtonComponent } from "@shared/button/button.component";

@Component({
    selector: "hbp-cta-form",
    standalone: true,
    templateUrl: "./cta-form.component.html",
    styleUrl: "./cta-form.component.scss",
    imports: [ButtonComponent, ReactiveFormsModule, InputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaFormComponent extends HBForm {
    override setupForm() {
        return this.fb.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    submit() {
        if (!this.form.valid) return;

        this.form.reset();
    }
}
