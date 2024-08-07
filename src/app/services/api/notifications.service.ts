import { inject, Injectable } from "@angular/core";
import { HBApiService } from "@services";
import { catchError, concatMap, delay, map, Observable, tap } from "rxjs";
import { Notification, PageableItems } from "@types";
import { RxStompService } from "./rx-stomp.service";
import { UserService } from "../state";

type NotificationsResponse = {
    type: string;
    body: {
        numberOfUnread: number;
        notifications: Notification[];
    };
};

@Injectable({
    providedIn: "root",
})
export class NotificationsService extends HBApiService {
    wsService = inject(RxStompService);
    userService = inject(UserService);

    getSummary(): Observable<NotificationsResponse["body"]> {
        return this.wsService
            .watch({
                destination: `/topic/user/${crypto.randomUUID()}`,
            })
            .pipe(
                concatMap((stream) =>
                    this.wsService.watch({
                        destination: `/queue/notifications/${stream.body}`,
                    }),
                ),
                map((message) => {
                    const messages = JSON.parse(
                        message.body,
                    ) as NotificationsResponse;

                    return messages.body;
                }),
                tap(async ({ notifications }) => {
                    const deleteNotification = notifications.find(
                        (not) => not.type === "CLEAR",
                    );
                    if (deleteNotification) {
                        this.userService.removeUser();
                        await this.router.navigate([""]);
                    }
                }),
            );
    }

    getDetailedNotifications(page = 0): Observable<{
        notifications: Notification[];
        totalElements: number;
    }> {
        return this.http
            .get<{
                notifications: PageableItems<Notification>;
                numberOfUnread: number;
            }>(`${this.baseUrl}/${this.userService.user?.id}/notifications`, {
                params: {
                    page,
                    size: 10,
                },
                ...this.headers,
            })
            .pipe(
                map((response) => {
                    return {
                        notifications: response.notifications.content,
                        totalElements: response.notifications.totalElements,
                    };
                }),
                catchError((e) => this.onError(e, true)),
            );
    }

    markAsRead(count: "all" | "some" = "some", notificationIds?: number[]) {
        let payload;
        if (count === "some") {
            payload = {
                userId: this.userService.user?.id,
                notificationIds,
            };
        } else {
            payload = {
                userId: this.userService.user?.id,
                markAll: true,
            };
        }

        return this.http.patch(
            `${this.baseUrl}/${this.userService.user?.id}/notifications`,
            payload,
            this.headers,
        );
    }

    getMockNotifications(
        page: number = 1,
        limit: number = 10,
    ): Observable<PageableItems<Notification>> {
        return this.http
            .get<Notification[]>(`assets/dummy-data/notifications.json`)
            .pipe(
                delay(2000),
                map((notifications) => {
                    return {
                        content: notifications.slice(
                            (page - 1) * limit,
                            page * limit,
                        ),
                        size: limit,
                        number: page,
                        last: true,
                        first: true,
                        empty: false,
                        sort: {
                            empty: true,
                            sorted: false,
                            unsorted: true,
                        },
                    } as PageableItems<Notification>;
                }),
            );
    }
}
