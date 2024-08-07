import { Injectable, inject } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class ParamService {
    #activatedRoute = inject(ActivatedRoute);
    queryParams: Params = {};

    constructor() {
        this.#activatedRoute.queryParams.subscribe((params) => {
            this.queryParams = { ...this.queryParams, ...params };
        });
    }

    getParams() {
        return this.queryParams;
    }
}
