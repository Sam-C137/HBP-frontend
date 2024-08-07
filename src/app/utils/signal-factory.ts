import { WritableSignal, signal } from "@angular/core";
import { ApiError, ApiSignal, SystemGeneric } from "@types";

export class SignalFactory {
    static create<T, U = ApiError>() {
        return signal<ApiSignal<T, U>>({
            loading: false,
            error: null,
            data: null,
        });
    }

    static pend<T extends object>(signal: WritableSignal<ApiSignal<T>>) {
        signal.set({
            loading: true,
            error: null,
            data: null,
        });
    }

    static complete<T extends object>(
        signal: WritableSignal<ApiSignal<T>>,
        data: T,
    ) {
        signal.set({
            loading: false,
            error: null,
            data,
        });
    }

    static error<T extends object>(
        signal: WritableSignal<ApiSignal<T>>,
        error: SystemGeneric,
    ) {
        signal.set({
            loading: false,
            error,
            data: null,
        });
    }
}
