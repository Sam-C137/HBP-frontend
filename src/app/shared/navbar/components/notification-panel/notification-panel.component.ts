import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
    model,
    signal,
} from "@angular/core";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Notification } from "@types";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { NotificationsService } from "@services/api/notifications.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "hbp-notification-panel",
    standalone: true,
    imports: [UserAvatarComponent, CommonModule, RouterLink, SpinnerComponent],
    templateUrl: "./notification-panel.component.html",
    styleUrl: "./notification-panel.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPanelComponent implements OnInit {
    public notifications: Notification[] = [];
    private notificationsService = inject(NotificationsService);
    private cdr = inject(ChangeDetectorRef);
    private destroyer$ = inject(DestroyRef);
    public isNotificationsLoading = false;
    public count = signal(0);
    public newNotification = model(false);

    ngOnInit() {
        this.getNotifications();
    }

    private getNotifications() {
        this.isNotificationsLoading = true;
        this.notificationsService
            .getSummary()
            .pipe(takeUntilDestroyed(this.destroyer$))
            .subscribe(({ notifications, numberOfUnread }) => {
                this.isNotificationsLoading = false;
                this.count.set(numberOfUnread);
                this.newNotification.set(numberOfUnread > 0);
                this.notifications = [...notifications];
                this.cdr.detectChanges();
            });
    }

    public markAllAsRead() {
        this.notificationsService
            .markAsRead("all")
            .pipe(takeUntilDestroyed(this.destroyer$))
            .subscribe();
    }

    public markAsRead(id: number) {
        this.notificationsService.markAsRead("some", [id]).subscribe();
    }
}
