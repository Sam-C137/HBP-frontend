import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from "@angular/core";
import { TableComponent } from "@shared/tables/table/table.component";
import { TableRowDirective } from "@shared/tables/table/table-row.directive";
import { TableHeadDirective } from "@shared/tables/table/table-head.directive";
import { Confirm, Title } from "@utils";
import {
    DatePipe,
    LowerCasePipe,
    NgOptimizedImage,
    TitleCasePipe,
} from "@angular/common";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { ServiceAvatarComponent } from "@shared/avatars/service-avatar/service-avatar.component";
import { HBConfirmableActions } from "@services";
import { toObservable } from "@angular/core/rxjs-interop";
import { DashboardService } from "@services/api/dashboard.service";
import {
    injectMutation,
    injectQuery,
} from "@tanstack/angular-query-experimental";
import { BarsComponent } from "@shared/loaders/bars/bars.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { UserManagementService } from "@services/api/user-management.service";
import { Roles, User } from "@types";
import { Chart, ChartModule } from "angular-highcharts";

@Component({
    selector: "hbp-admin-dashboard-page",
    standalone: true,
    imports: [
        TableComponent,
        TableRowDirective,
        TableHeadDirective,
        DatePipe,
        LowerCasePipe,
        TitleCasePipe,
        NgOptimizedImage,
        UserAvatarComponent,
        ServiceAvatarComponent,
        BarsComponent,
        ErrorHandlerComponent,
        ChartModule,
    ],
    templateUrl: "./admin-dashboard-page.component.html",
    styleUrl: "./admin-dashboard-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatePipe],
})
export class AdminDashboardPageComponent extends HBConfirmableActions {
    @Title
    readonly title = "Admin Dashboard";
    private dashboardService = inject(DashboardService);
    private userManagementService = inject(UserManagementService);
    override modalLoading = toObservable(
        computed(() => this.cancelDoctorInviteMutation.isPending()),
    );
    selectedUser?: Partial<User> & { dateInvited: string };
    private datepipe = inject(DatePipe);

    protected dashboardQuery = injectQuery(() => ({
        queryKey: ["admin-dashboard-info"],
        queryFn: () => this.dashboardService.getAdminDashBoardInfo(),
    }));

    protected cancelDoctorInviteMutation = injectMutation(() => ({
        mutationFn: (user: Partial<User>) =>
            this.userManagementService.cancelUserInvite(user),
        onSuccess: async () => {
            await this.dashboardQuery.refetch();
        },
    }));

    protected resendDoctorInviteMutation = injectMutation(() => ({
        mutationFn: (user: Partial<User>) =>
            this.userManagementService.resendUserInvitation(user),
    }));

    @Confirm({
        title: "Cancel Invite",
    })
    public cancelInvite() {
        if (!this.selectedUser) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dateInvited, ...rest } = this.selectedUser;
        this.cancelDoctorInviteMutation.mutate(rest);
    }

    public sendReminder() {
        if (!this.selectedUser) return;
        this.resendDoctorInviteMutation.mutate(this.selectedUser);
    }

    private newDoctors = computed(() =>
        this.dashboardQuery
            .data()
            ?.newUsers.filter(
                (user) => user.role === Roles.Doctor.toUpperCase(),
            ),
    );

    private newPatients = computed(() =>
        this.dashboardQuery
            .data()
            ?.newUsers.filter(
                (user) => user.role === Roles.Patient.toUpperCase(),
            ),
    );

    private xAxis = computed(
        () =>
            Array.from({ length: 7 }, (_, i) =>
                this.datepipe.transform(
                    new Date(Date.now() - i * 86400000),
                    "yyyy-MM-dd",
                ),
            ).reverse() as string[],
    );

    chart = computed(
        () =>
            new Chart({
                credits: {
                    enabled: false,
                },
                chart: {
                    type: "spline",
                },
                title: {
                    text: undefined,
                },
                xAxis: {
                    categories: this.xAxis(),
                    labels: {
                        style: {
                            fontFamily: "Montserrat",
                            fontWeight: "500",
                        },
                    },
                },
                yAxis: {
                    gridLineDashStyle: "Dash",
                    gridLineColor: "#AFB1B0",
                    title: {
                        text: "Number of Users",
                        style: {
                            fontWeight: "600",
                            fontSize: "1rem",
                            fontFamily: "Montserrat",
                        },
                    },
                    labels: {
                        style: {
                            fontFamily: "Montserrat",
                            fontWeight: "500",
                        },
                    },
                },
                series: [
                    {
                        name: "Doctors",
                        type: "spline",
                        data: this.xAxis().map((day) => {
                            const occurrence = this.newDoctors()?.filter(
                                (user) => user.dateInvited === day,
                            );
                            return occurrence?.length ?? 0;
                        }),
                    },
                    {
                        name: "Patients",
                        type: "spline",
                        data: this.xAxis().map((day) => {
                            const occurrence = this.newPatients()?.filter(
                                (user) => user.dateInvited === day,
                            );
                            return occurrence?.length ?? 0;
                        }),
                    },
                ],
                colors: ["#FFA500", "#FF0000"],
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true,
                            symbol: "circle",
                        },
                    },
                },
            }),
    );
}
