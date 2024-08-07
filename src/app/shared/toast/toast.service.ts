import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector,
    inject,
} from "@angular/core";
import { ToastComponent } from "./toast.component";
import { SystemGeneric } from "@/app/libs/types";

export type ToastConfig = {
    message: string;
    status: "success" | "error" | "warning";
    interval?: number;
};

export const animationDelay = 800;

@Injectable({
    providedIn: "root",
})
export class ToastService {
    private toastRef?: ComponentRef<ToastComponent>;
    private componentFactoryResolver = inject(ComponentFactoryResolver);
    private appRef = inject(ApplicationRef);
    private injector = inject(Injector);

    public toast({ message, status, interval = 3500 }: ToastConfig) {
        this.toastRef = this.componentFactoryResolver
            .resolveComponentFactory(ToastComponent)
            .create(this.injector);

        this.toastRef.setInput("config", { message, status, interval });
        this.toastRef.instance.closeEvent.subscribe(() => {
            this.closeToast();
        });

        this.appRef.attachView(this.toastRef.hostView);

        const domElem = (
            this.toastRef.hostView as EmbeddedViewRef<SystemGeneric>
        ).rootNodes[0] as HTMLElement;

        document.body.appendChild(domElem);
    }

    private closeToast() {
        setTimeout(() => {
            this.toastRef && this.appRef.detachView(this.toastRef.hostView);
            this.toastRef?.destroy();
        }, animationDelay);
    }
}
