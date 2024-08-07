/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { FormValidator } from "@app/utils";
import { Subject } from "rxjs";

@Component({ template: "", standalone: true })
export abstract class HBForm implements OnInit {
    protected fb = inject(FormBuilder);
    protected nfb = inject(NonNullableFormBuilder);
    protected form!: FormGroup;
    protected formValidator!: FormValidator;
    protected $destroyer = new Subject<void>();

    ngOnInit() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
    }

    abstract setupForm(): FormGroup;
}
