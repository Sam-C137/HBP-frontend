import { Injectable } from "@angular/core";
import { HBApiService } from "../hb-api.service";
import { ApiSuccess, PageableItems, Service, ServiceIcon } from "@types";
import { catchError, lastValueFrom, tap } from "rxjs";

export type Filters = {
    search: string;
    status: string;
    page: number;
    size: number;
};

@Injectable({
    providedIn: "root",
})
export class ServiceManagementService extends HBApiService {
    getAll(params: Partial<Filters>): Promise<PageableItems<Service>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<Service>>(`${this.baseUrl}/services`, {
                    params: {
                        ...params,
                        size: 10,
                    },
                    ...this.headers,
                })
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    toggleStatus(
        service: Service,
        status: "active" | "inactive",
    ): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/services/${service.id}/status`,
                    { status },
                    this.headers,
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    updateService(
        service: Partial<Service>,
        serviceId: number,
    ): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/services/${serviceId}`,
                    service,
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully updated ${service.name}`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    createService(service: Partial<Service>): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .post<ApiSuccess>(
                    `${this.baseUrl}/services`,
                    service,
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully created ${service.name}`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    deleteService(service: Service): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .delete<ApiSuccess>(
                    `${this.baseUrl}/services/${service.id}`,
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully deleted ${service.name}`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    getServiceIcons(
        params: Partial<Filters>,
    ): Promise<PageableItems<ServiceIcon>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<ServiceIcon>>(
                    `${this.baseUrl}/services/icons`,
                    {
                        params: {
                            ...params,
                        },
                        ...this.headers,
                    },
                )
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }
}
