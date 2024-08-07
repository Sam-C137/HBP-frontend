import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TextareaComponent } from "./textarea.component";
import { ComponentRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

describe("TextareaComponent", () => {
    let component: TextareaComponent;
    let fixture: ComponentFixture<TextareaComponent>;
    let componentRef: ComponentRef<TextareaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TextareaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TextareaComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("id", "testId");
        const form = new FormGroup({
            name: new FormControl("testName"),
        });
        componentRef.setInput("control", form.get("name"));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have an id", () => {
        expect(component.id()).toBe("testId");
    });

    it("should have a control", () => {
        expect(component.control()).toBeTruthy();
    });

    it("should be able to span multiple rows", () => {
        componentRef.setInput("rows", 10);
        fixture.detectChanges();
        expect(component.rows()).toBe(10);
    });

    it("should render a textarea", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("textarea")).toBeTruthy();
    });
});
