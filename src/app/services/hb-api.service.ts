import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { SignalFactory } from "@utils";
import { Router } from "@angular/router";
import { ToastService } from "@shared/toast/toast.service";
import { environment } from "@/environments/environment.development";
import { TokenService } from "@services/state";

export abstract class HBApiService {
    protected destroyer$ = new Subject<void>();
    protected http = inject(HttpClient);
    protected router = inject(Router);
    protected toastService = inject(ToastService);
    protected tokenService = inject(TokenService);
    protected baseUrl = environment.baseUrl;
    protected SignalFactory = SignalFactory;

    /**
     * Returns standard headers
     * @returns {HttpHeaders}
     */
    protected get headers() {
        return {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "skip-browser-warning",
            }),
        };
    }

    /**
     * Handles the HTTP error response.
     * @param error The HTTP error response.
     * @returns An observable of the error.
     */
    protected onError(error: HttpErrorResponse, toast: boolean = false) {
        let message = "";
        switch (error.status) {
            case 0:
                // console.error(error.error);
                message = "Couldn't connect. Please try again";
                toast &&
                    this.toastService.toast({
                        message,
                        status: "error",
                    });
                return throwError(() => ({
                    message,
                }));
            case 500:
                message =
                    "An error occurred on the server. Please try again later.";
                toast &&
                    this.toastService.toast({
                        message,
                        status: "error",
                    });
                return throwError(() => ({
                    message,
                }));
            case 403:
                this.router.navigate(["/auth/login"]);
                this.tokenService.clear();
                message = "Please login to continue";
                toast &&
                    this.toastService.toast({
                        message,
                        status: "error",
                    });
                return throwError(() => ({
                    message,
                }));
            default:
                console.error(error.error);
                if (Array.isArray(error.error.message)) {
                    error.error.message = error.error.message.join(", ");
                }
                message =
                    error.error.message ||
                    "An error occurred. Please try again";
                toast &&
                    this.toastService.toast({
                        message,
                        status: "error",
                    });
                return throwError(() => error.error);
        }
    }

    destroy() {
        this.destroyer$.next();
        this.destroyer$.complete();
    }
}
