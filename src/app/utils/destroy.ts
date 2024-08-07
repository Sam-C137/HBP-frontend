import { SystemGeneric } from "../libs/types";

/**
 * @description Automatically detroys any service marked with this decorator
 *
 * @example
 * ```ts
 * export class HomePage {
 *   @Destroy
 *   service = inject(SomeService);
 * }
 * ```
 *
 * here the destroy method of the service will be called when the component is destroyed
 * note that the service must have a destroy method
 */
export function Destroy(target: SystemGeneric, property: string) {
    const originalOnDestroy = target.ngOnDestroy;

    target.ngOnDestroy = function () {
        if (this[property] && typeof this[property].destroy === "function") {
            this[property].destroy();
        }

        if (originalOnDestroy) {
            originalOnDestroy.apply(this);
        }
    };
}
