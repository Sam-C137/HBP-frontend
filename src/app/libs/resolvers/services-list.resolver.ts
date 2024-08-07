import { inject } from "@angular/core";
import { catchError, filter, lastValueFrom, of } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { HttpClient } from "@angular/common/http";
import { PageableItems, Service } from "../types";
import { environment } from "@/environments/environment.development";
import { mockServicesList } from "@utils";

export const servicesListResolver = () => {
    const http = inject(HttpClient);
    const services = injectQuery(() => ({
        queryKey: ["landing-page-services"],
        queryFn: () =>
            lastValueFrom(
                http
                    .get<PageableItems<Service>>(
                        `${environment.baseUrl}/services`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "ngrok-skip-browser-warning":
                                    "skip-browser-warning",
                            },
                        },
                    )
                    .pipe(
                        catchError(() => {
                            return of({
                                error: null,
                                loading: false,
                                data: {
                                    content: mockServicesList,
                                    totalPages: 1,
                                    totalElements: 10,
                                    size: 10,
                                    number: 1,
                                },
                            });
                        }),
                    ),
            ),
        retry: 0,
    }));

    return toObservable(services.data).pipe(filter(Boolean));
};
