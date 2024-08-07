import { NavbarComponent } from "@shared/navbar/navbar.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { IntersectionObserverDirective } from "@directives";
import { UserService } from "@/app/services/state";
import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    signal,
} from "@angular/core";
import { Notification } from "@types";
import { NotificationsService } from "@services/api/notifications.service";
import { catchError, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ReviewOverlayComponent } from "./review-overlay/review-overlay.component";
import { BarsComponent } from "../loaders/bars/bars.component";

@Component({
    selector: "hbp-notifications-page",
    standalone: true,
    imports: [
        NavbarComponent,
        BreadcrumbComponent,
        UserAvatarComponent,
        CommonModule,
        IntersectionObserverDirective,
        ReviewOverlayComponent,
        BarsComponent,
    ],
    templateUrl: "./notifications-page.component.html",
    styleUrl: "./notifications-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPageComponent {
    private notificationsService = inject(NotificationsService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);
    public user = inject(UserService).user;
    public notifications: Notification[] = [];
    public isNotificationsLoading = false;
    public isReviewOverlayVisible = false;
    public pageNumber = signal(1);
    public totalElements = signal<number | undefined>(undefined);
    public isAtNotificationEnd =
        this.totalElements() &&
        this.notifications.length >= this.totalElements()!;
    protected Number = Number;

    public getNotifications() {
        if (
            this.totalElements() &&
            this.notifications.length >= this.totalElements()!
        )
            return;
        this.isNotificationsLoading = true;

        this.notificationsService
            .getDetailedNotifications(this.pageNumber())
            .pipe(
                tap(({ notifications, totalElements }) => {
                    this.isNotificationsLoading = false;
                    this.notifications = [
                        ...this.notifications,
                        ...notifications,
                    ];
                    this.totalElements.set(totalElements);
                    this.cdr.detectChanges();
                    this.pageNumber.set(this.pageNumber() + 1);
                }),
                takeUntilDestroyed(this.destroyRef),
                catchError(() => {
                    this.isNotificationsLoading = false;
                    this.cdr.detectChanges();
                    return [];
                }),
            )
            .subscribe();
    }

    public notificationAction(
        type: Notification["type"],
        notification: Notification,
    ) {
        switch (type) {
            case "BOOK":
                this.router.navigate(["/patient/home"]);
                break;
            case "REVIEW":
                this.isReviewOverlayVisible = true;
                history.pushState(
                    {
                        doctor: {
                            fullName: notification.senderName,
                            id: notification.senderId,
                            profilePicture: notification.profilePicture,
                        },
                    },
                    "",
                );
                break;
            case "ACCOUNT":
                this.router.navigate(["/" + this.user?.role, "profile"]);
                break;
            default:
                break;
        }

        if (!notification.receipt) {
            this.notificationsService
                .markAsRead("some", [notification.id])
                .subscribe();
        }
    }
}
