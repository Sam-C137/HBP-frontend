import { DOCUMENT } from "@angular/common";
import {
    ComponentRef,
    Inject,
    Injectable,
    Injector,
    TemplateRef,
    ViewContainerRef,
    inject,
} from "@angular/core";
import { ConfirmationModalComponent } from "./confirmation-modal.component";
import { Observable } from "rxjs";
import { SystemGeneric } from "@/app/libs/types";

export type ConfirmationDetails = {
    title?: string;
    submit?: string;
    cancel?: string;
};

@Injectable({
    providedIn: "root",
})
export class ConfirmationModalService {
    @Inject(DOCUMENT) private document?: Document;
    private injector = inject(Injector);

    open(
        viewContainerRef: ViewContainerRef,
        content: TemplateRef<SystemGeneric>,
        {
            title = "Do you want to continue?",
            submit = "Yes, continue",
            cancel = "Cancel",
        }: ConfirmationDetails,
        loadingState: Observable<boolean>,
    ) {
        if (!content) {
            throw new Error(
                "Content must be defined in the html template with a ref #modalTemplate",
            );
        }
        const contentViewRef = content.createEmbeddedView(null);
        const modalComponentRef = viewContainerRef.createComponent(
            ConfirmationModalComponent,
            {
                injector: this.injector,
                projectableNodes: [[...contentViewRef.rootNodes]],
            },
        );

        modalComponentRef.setInput("details", { title, submit, cancel });
        modalComponentRef.setInput("loading", loadingState);

        modalComponentRef.instance.cancelEvent.subscribe(() =>
            this.close(modalComponentRef),
        );
        this.document?.body.appendChild(
            modalComponentRef.location.nativeElement,
        );
        contentViewRef.detectChanges();
        return modalComponentRef;
    }

    close(componentRef: ComponentRef<ConfirmationModalComponent>) {
        componentRef.destroy();
    }
}
