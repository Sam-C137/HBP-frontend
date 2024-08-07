import { SystemGeneric } from "../libs/types";
/**
 * @description Runs the target function only if the user has set no preference for
 * reduced motion
 *
 * @example
 * ```ts
 * export class ItemsPage {
 *   @RunOutsideReducedMotion
 *   someFancyAnimation(){
 *      return;
 *   }
 * }
 * ```
 */

export function RunOutsideReducedMotion(
    target: SystemGeneric,
    property: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return original.apply(this, args);
        }
        return null;
    };

    return descriptor;
}
