/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnDestroy, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "@services/state";
import { Subject } from "rxjs";
import { Title } from "@utils";

@Component({
    template: "",
})
export abstract class HBPage implements OnDestroy {
    @Title
    abstract title: string;
    protected user = inject(UserService).user;
    protected destroyer$ = new Subject<void>();
    protected router = inject(Router);
    protected activatedRoute = inject(ActivatedRoute);

    ngOnDestroy() {
        this.destroyer$.next();
        this.destroyer$.complete();
    }
}
