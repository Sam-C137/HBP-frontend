/**
 * @description Caches the result of a function based on its arguments
 *
 * @example
 * ```ts
 * class MyClass {
 *   @Cache
 *   expensiveMethod(arg1: any, arg2: any) {
 *       // Expensive computation...
 *      return result;
 *   }
 *
 * // the result of getSomeData will be cached based on its arguments
 * ```
 */

export function Cache(
    target: NonNullable<unknown>,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;
    const cache = new Map();

    descriptor.value = function (...args: unknown[]) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };

    return descriptor;
}
