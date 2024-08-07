import { listStagger } from "@animations";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { ButtonComponent } from "@shared/button/button.component";
import { lighten, Title } from "@utils";
import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TimePipe } from "@pipes";
import { IntersectionObserverDirective } from "@directives";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AppointmentManagementService } from "@services/api/appointment-management.service";
import {
    injectInfiniteQuery,
    injectQuery,
} from "@tanstack/angular-query-experimental";
import { BarsComponent } from "@shared/loaders/bars/bars.component";

@Component({
    selector: "hbp-patient-profile-page",
    standalone: true,
    imports: [
        RouterLink,
        UserAvatarComponent,
        ButtonComponent,
        CommonModule,
        TimePipe,
        RouterLink,
        IntersectionObserverDirective,
        BarsComponent,
    ],
    templateUrl: "./patient-profile-page.component.html",
    styleUrl: "./patient-profile-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [listStagger],
})
export class PatientProfilePageComponent {
    @Title
    title = "";
    private activatedRoute = inject(ActivatedRoute);
    private appointmentmanagementService = inject(AppointmentManagementService);
    protected patientId = "";
    public sideview: "appointment-history" | "medical-records" =
        "appointment-history";
    protected lighten = lighten;

    constructor() {
        this.activatedRoute.params
            .pipe(takeUntilDestroyed())
            .subscribe((params) => {
                this.patientId = params["id"];
            });
        effect(() => {
            if (this.patientInfoQuery.data()) {
                this.title =
                    "Profile: " + this.patientInfoQuery.data()?.patientName;
            }
        });
    }

    protected patientInfoQuery = injectQuery(() => ({
        queryKey: ["patient-info"],
        queryFn: () =>
            this.appointmentmanagementService.getPatientInfo(this.patientId),
    }));

    protected appointmentHistoryQuery = injectInfiniteQuery(() => ({
        queryKey: ["patient-appointments"],
        queryFn: async ({ pageParam }) => {
            return this.appointmentmanagementService.getAppointmentHistory(
                this.patientId,
                {
                    page: pageParam,
                },
            );
        },
        initialPageParam: 1,
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            if (firstPageParam <= 1) {
                return undefined;
            }
            return firstPageParam - 1;
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.last) {
                return undefined;
            }
            return lastPageParam + 1;
        },
        maxPages: 3,
    }));

    protected isFetchDisabled = computed(
        () =>
            !this.appointmentHistoryQuery.hasNextPage() ||
            this.appointmentHistoryQuery.isFetchingNextPage() ||
            this.appointmentHistoryQuery.isFetching(),
    );

    protected endOfList = computed(
        () =>
            !this.appointmentHistoryQuery.isPending() &&
            !this.appointmentHistoryQuery.hasNextPage() &&
            !this.appointmentHistoryQuery.isFetchingNextPage(),
    );
}
