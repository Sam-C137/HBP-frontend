import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class CacheService<T> {
    private cache = new Map<string, T>();

    has(key: string) {
        return this.cache.has(key);
    }

    get(key: string) {
        return this.cache.get(key);
    }

    set(key: string, value: T) {
        this.cache.set(key, value);
    }

    delete(key: string) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    keys() {
        return this.cache.keys();
    }
}
