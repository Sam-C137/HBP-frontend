/**
 * @description Decorator that sets a property on the class as the title of the page
 *
 * @example
 * ```ts
 * export class HomePage {
 *   @Title
 *   title = "Home";
 * }
 * ```
 */

import { SystemGeneric } from "../libs/types";

export function Title(target: SystemGeneric, property: string) {
    type Key = keyof typeof target;
    let val = target[property as Key];

    const getter = () => {
        return val;
    };

    const setter = (next: typeof val) => {
        val = next;
        document.title = `${val} — HBP`;
    };

    Object.defineProperty(target, property, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}
