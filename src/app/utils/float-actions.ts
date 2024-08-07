import { SystemGeneric } from "../libs/types";

export class FloatActions {
    floatOpen = false;
    timeoutIds = new Map<HTMLElement, SystemGeneric>();

    mouseEnter(floatElement: HTMLElement) {
        clearTimeout(this.timeoutIds.get(floatElement));
        floatElement.classList.add("open");
        this.floatOpen = true;
    }

    mouseLeave(floatElement: HTMLElement) {
        this.timeoutIds.set(
            floatElement,
            setTimeout(() => {
                floatElement.classList.remove("open");
            }, 500),
        );
        this.floatOpen = false;
    }

    immediateLeave(floatElement: HTMLElement) {
        clearTimeout(this.timeoutIds.get(floatElement));
        floatElement.classList.remove("open");
        this.floatOpen = false;
    }
}
