import { Component, Host, input } from "@angular/core";
import { CheckBoxGroupComponent } from "../check-box-group.component";
import { LowerCasePipe } from "@angular/common";

@Component({
    selector: "hbp-check-box",
    standalone: true,
    imports: [LowerCasePipe],
    templateUrl: "./check-box.component.html",
    styleUrl: "./check-box.component.scss",
})
export class CheckBoxComponent {
    value = input<string>("");
    label = input<string>("");

    constructor(@Host() public checkboxGroup: CheckBoxGroupComponent) {}
}
