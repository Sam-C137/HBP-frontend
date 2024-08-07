import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HBForm } from "@services";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "@shared/inputs/input/input.component";
import { TextareaComponent } from "@shared/inputs/textarea/textarea.component";
import { ButtonComponent } from "@shared/button/button.component";

@Component({
    selector: "hbp-about-page-form",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        TextareaComponent,
        ButtonComponent,
    ],
    templateUrl: "./about-page-form.component.html",
    styleUrl: "./about-page-form.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageFormComponent extends HBForm {
    override setupForm() {
        return this.fb.group({
            name: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            message: ["", [Validators.required]],
        });
    }

    submit() {
        if (this.form.invalid) return this.form.markAllAsTouched();
        this.form.reset();
    }
}
