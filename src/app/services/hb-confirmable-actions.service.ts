/* eslint-disable @angular-eslint/component-class-suffix */
import {
    Component,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    inject,
} from "@angular/core";
import { ConfirmationModalService } from "@shared/modals/confirmation-modal/confirmation-modal.service";
import { Observable } from "rxjs";
import { SystemGeneric } from "../libs/types";

@Component({
    template: "",
})
export abstract class HBConfirmableActions {
    modalService = inject(ConfirmationModalService);
    viewContainerRef = inject(ViewContainerRef);

    @ViewChild("modalTemplate") modalTemplate?: TemplateRef<SystemGeneric>;

    abstract modalLoading: Observable<boolean>;
}
