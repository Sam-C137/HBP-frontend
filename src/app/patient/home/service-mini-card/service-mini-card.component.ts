import { Service, SystemGeneric } from "@types";
import { Component, input } from "@angular/core";
import { ServiceAvatarComponent } from "@shared/avatars/service-avatar/service-avatar.component";
import {
    AbstractControl,
    FormControl,
    ReactiveFormsModule,
} from "@angular/forms";

@Component({
    selector: "hbp-service-mini-card",
    standalone: true,
    imports: [ServiceAvatarComponent, ReactiveFormsModule],
    templateUrl: "./service-mini-card.component.html",
    styleUrl: "./service-mini-card.component.scss",
})
export class ServiceMiniCardComponent {
    service = input.required<Service>();
    control = input.required<AbstractControl | FormControl | SystemGeneric>();
    name = input.required<string>();
    value = input.required<string | number>();
}
