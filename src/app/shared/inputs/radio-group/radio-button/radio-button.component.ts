import { LowerCasePipe } from "@angular/common";
import { Component, Host, input } from "@angular/core";
import { RadioGroupComponent } from "../radio-group.component";

@Component({
    selector: "hbp-radio-button",
    standalone: true,
    imports: [LowerCasePipe],
    templateUrl: "./radio-button.component.html",
    styleUrl: "./radio-button.component.scss",
})
export class RadioButtonComponent {
    label = input.required<string>();
    value = input.required<string>();

    constructor(@Host() public radioGroup: RadioGroupComponent) {}
}
