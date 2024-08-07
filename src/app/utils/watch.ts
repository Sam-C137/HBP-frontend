/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleChanges } from "@angular/core";

/**
 * @description Behaves like the \@Watch decorator in stenciljs
 *
 * @example
 * ```ts
 * export class HomePage {
 *  @Input() title: string;
 *
 *  @Watch('property', {current: true})
 *  onTitleChange(val: string) {
 *     console.log('title changed', val);
 *  }
 *
 * }
 * ```
 * Here the onTitleChange method will be called when the property changes
 * with the new value as an argument.
 * Omit current or set current to false to get the whole simple changes object
 */

export function Watch(
    property: string,
    config?: {
        current: boolean;
    },
) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const originalNgOnChanges = target.ngOnChanges;

        target.ngOnChanges = function (changes: SimpleChanges) {
            if (originalNgOnChanges) {
                originalNgOnChanges.call(this, changes);
            }

            if (changes[property]) {
                const arg = config?.current
                    ? changes[property].currentValue
                    : changes[property];
                return originalMethod.call(this, arg);
            }
        };

        return descriptor;
    };
}
