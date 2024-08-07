import {
    ComponentRef,
    Injectable,
    Injector,
    TemplateRef,
    ViewContainerRef,
    inject,
} from "@angular/core";
import { DropdownComponent } from "./dropdown.component";
import { SystemGeneric } from "@/app/libs/types";

@Injectable({
    providedIn: "root",
})
export class DropdownService {
    private injector = inject(Injector);
    private ref?: ComponentRef<DropdownComponent>;

    open(
        content: TemplateRef<SystemGeneric>,
        viewContainerRef: ViewContainerRef,
        position: { top: number; left: number },
        event: MouseEvent,
    ) {
        const contentViewRef = content.createEmbeddedView(null);
        const dropdownComponentRef = viewContainerRef.createComponent(
            DropdownComponent,
            {
                injector: this.injector,
                projectableNodes: [[...contentViewRef.rootNodes]],
            },
        );
        const triggerElement = event.target as HTMLElement;
        const rect = triggerElement.getBoundingClientRect();
        const newPosition = {
            top: rect.top + window.scrollY + position.top,
            left: rect.left + window.scrollX + position.left,
        };
        dropdownComponentRef.setInput("position", newPosition);
        event.stopPropagation();
        dropdownComponentRef.instance.close.subscribe(() =>
            this.destroyDropdown(dropdownComponentRef),
        );
        contentViewRef.detectChanges();
        this.ref = dropdownComponentRef;
        return dropdownComponentRef;
    }

    private destroyDropdown(
        dropdownComponentRef: ComponentRef<DropdownComponent>,
    ) {
        dropdownComponentRef.destroy();
    }

    public close() {
        if (this.ref) {
            this.destroyDropdown(this.ref);
        }
    }
}
