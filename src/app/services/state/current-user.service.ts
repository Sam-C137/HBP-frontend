import { Injectable, effect, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { User } from "@types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mockUser as user } from "@/app/utils";
import { CURRENT_USER_KEY } from "@/app/libs/constants";
import { RxStompService } from "../api/rx-stomp.service";
import { TokenService } from "./token.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private _user = signal<User | undefined>(undefined);
    #chatService = inject(RxStompService);
    #tokenService = inject(TokenService);

    public userUpdated$ = toObservable(this._user);

    constructor() {
        effect(() => {
            if (this._user()) {
                localStorage.setItem(
                    CURRENT_USER_KEY,
                    JSON.stringify(this._user()),
                );
                this.#chatService.configure({
                    connectHeaders: {
                        Authorization: this.#tokenService.get()!,
                    },
                });
                this.#chatService.activate();
            }
        });
    }

    get user(): User | undefined {
        if (this._user()) {
            return this._user();
        } else if (localStorage.getItem(CURRENT_USER_KEY)) {
            this._user.set(JSON.parse(localStorage.getItem(CURRENT_USER_KEY)!));
            return this._user();
        }
        return undefined;
    }

    set user(user: User | undefined) {
        this._user.set(user);
    }

    removeUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
        this._user.set(undefined);
        this.#chatService.deactivate();
        this.#chatService.setContacts(undefined);
    }
}
