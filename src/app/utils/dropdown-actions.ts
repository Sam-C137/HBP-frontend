import {
    ComponentRef,
    TemplateRef,
    ViewContainerRef,
    inject,
} from "@angular/core";
import { DropdownService } from "@shared/dropdown/dropdown.service";
import { SystemGeneric } from "../libs/types";

export class DropdownActions {
    private dropdown = inject(DropdownService);
    private viewContainerRef = inject(ViewContainerRef);
    private existingRef?: ComponentRef<SystemGeneric>;

    constructor(
        private position: { top: number; left: number } = { top: 0, left: 0 },
    ) {}

    openDropdown(event: MouseEvent, templateRef: TemplateRef<SystemGeneric>) {
        if (this.existingRef) {
            this.existingRef.destroy();
        }
        this.existingRef = this.dropdown.open(
            templateRef,
            this.viewContainerRef,
            this.position,
            event,
        );
    }

    closeDropdown() {
        if (this.existingRef) {
            this.existingRef.destroy();
        }
    }
}
