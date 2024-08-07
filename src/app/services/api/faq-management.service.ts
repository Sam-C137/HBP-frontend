import { Injectable } from "@angular/core";
import { HBApiService } from "../hb-api.service";
import { catchError, lastValueFrom, tap } from "rxjs";
import { ApiSuccess, Faq, PageableItems } from "@/app/libs/types";

export type Filters = {
    search: string;
    status: string;
    page: number;
    size: number;
    state: string;
};

@Injectable({
    providedIn: "root",
})
export class FaqManagementService extends HBApiService {
    getAll(params: Partial<Filters>): Promise<PageableItems<Faq>> {
        return lastValueFrom(
            this.http
                .get<PageableItems<Faq>>(`${this.baseUrl}/faq`, {
                    params: {
                        ...params,
                        size: 10,
                        sort: "updatedAt,createdAt,desc",
                    },
                    ...this.headers,
                })
                .pipe(catchError((e) => this.onError(e, true))),
        );
    }

    update(faq: Partial<Faq>, faqId: number): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/faq/${faqId}`,
                    faq,
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully updated ${faq.question}`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    create(faq: Faq, shouldPublish?: boolean): Promise<ApiSuccess> {
        const { question, answer } = faq;
        let body: Pick<Faq, "question" | "answer"> & { status?: string } = {
            question,
            answer,
        };
        if (shouldPublish) {
            body = {
                question,
                answer,
                status: "published",
            };
        }

        return lastValueFrom(
            this.http
                .post<ApiSuccess>(`${this.baseUrl}/faq`, body, this.headers)
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully ${shouldPublish ? "published" : "drafted"} ${faq.question}`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    delete(faqId: number): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .delete<ApiSuccess>(
                    `${this.baseUrl}/faq/${faqId}`,
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully deleted FAQ`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    restore(faq: Faq): Promise<ApiSuccess> {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/faq/${faq.id}/restore`,
                    {},
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully restored ${faq.question}`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }

    publish(faqId: number) {
        return lastValueFrom(
            this.http
                .patch<ApiSuccess>(
                    `${this.baseUrl}/faq/${faqId}/publish`,
                    {},
                    this.headers,
                )
                .pipe(
                    tap(() => {
                        this.toastService.toast({
                            message: `Successfully published FAQ`,
                            status: "success",
                        });
                    }),
                    catchError((e) => this.onError(e, true)),
                ),
        );
    }
}
