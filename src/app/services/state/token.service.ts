import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class TokenService {
    private tokenkey: string = "78yehqupeu";

    get() {
        return localStorage.getItem(this.tokenkey);
    }

    set(val: string) {
        localStorage.setItem(this.tokenkey, val);
    }

    clear() {
        localStorage.removeItem(this.tokenkey);
    }
}
