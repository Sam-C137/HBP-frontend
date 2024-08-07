import { UserService } from "@services/state";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from "@angular/core";
import { DashboardCardComponent } from "./dashboard-card/dashboard-card.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { DashboardService } from "@/app/services/api/dashboard.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { ChartData } from "./dashboard.types";
import { Confirm, convertDateToIsoWithoutZ } from "@/app/utils";
import { TimePipe } from "@/app/libs/pipes";
import { RouterLink } from "@angular/router";
import { listStagger } from "@/app/libs/animations";
import { AppointmentTableComponent } from "@/app/shared/tables/appointment-table/appointment-table.component";
import { AppointmentStatuses, Appointment } from "@/app/libs/types";
import { AppointmentManagementService } from "@/app/services/api/appointment-management.service";
import { EmptyListComponent } from "@/app/shared/empty-list/empty-list.component";
import { ErrorHandlerComponent } from "@/app/shared/error-handler/error-handler.component";
import {
    injectMutation,
    injectQuery,
} from "@tanstack/angular-query-experimental";
import { HBConfirmableActions } from "@/app/services";
import { STATS_DATA } from "@/app/libs/constants";
import { ChartComponent } from "./chart/chart.component";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { ContactLoaderComponent } from "@/app/shared/loaders/contact-loader/contact-loader.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";

@Component({
    selector: "hbp-dashboard",
    standalone: true,
    imports: [
        DashboardCardComponent,
        CalendarComponent,
        TimePipe,
        RouterLink,
        AppointmentTableComponent,
        EmptyListComponent,
        ErrorHandlerComponent,
        ChartComponent,
        SpinnerComponent,
        ContactLoaderComponent,
        UserAvatarComponent,
    ],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [listStagger],
})
export class DashboardComponent extends HBConfirmableActions {
    userService = inject(UserService);
    #dashboardService = inject(DashboardService);
    #appointmentManagementService = inject(AppointmentManagementService);
    selectedDate = signal<Date>(new Date());
    chartData = signal<ChartData>(this.getInitialChartData());
    doctorName = this.userService.user?.fullName;
    action = AppointmentStatuses.PENDING;
    selectedAppointment: Appointment | undefined;

    statsQuery = injectQuery(() => ({
        queryKey: ["dashboard-stats", this.userService.user?.id],
        queryFn: () =>
            this.#dashboardService.getAppointmentStats(
                this.userService.user!.id,
            ),
        refetchInterval: 1000 * 60 * 30,
    }));

    protected upcomingAppointmentsQuery = injectQuery(() => ({
        queryKey: [
            "doctor-daily-appointments",
            this.selectedDate().toLocaleDateString(),
        ],
        queryFn: () =>
            this.#dashboardService.getUpcomingAppointments(
                this.userService.user!.id,
                convertDateToIsoWithoutZ(this.selectedDate()),
            ),
        refetchInterval: 1000 * 60,
    }));

    protected appointmentsQuery = injectQuery(() => ({
        queryKey: ["doctor-appointments"],
        queryFn: () =>
            this.#appointmentManagementService.getAppointments(
                {
                    status: this.action,
                    page: 0,
                },
                this.userService.user!.id,
            ),
        refetchInterval: 1000 * 60,
    }));

    protected appointmentMutation = injectMutation((client) => ({
        mutationFn: (details: {
            bookingId: string | number;
            action: AppointmentStatuses;
        }) =>
            this.#appointmentManagementService.toggleAppointmentStatus(
                details,
                this.userService.user!.id,
            ),
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["doctor-appointments"],
            });
            await client.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "doctor-daily-appointments",
            });
        },
    }));

    override modalLoading = toObservable(
        computed(() => this.appointmentMutation.isPending()),
    );

    getInitialChartData(): ChartData {
        if (sessionStorage.getItem(STATS_DATA)) {
            return JSON.parse(sessionStorage.getItem(STATS_DATA)!);
        }
        return {
            total: [],
            cancelled: [],
            completed: [],
        };
    }

    onSelectedDateChange(date: Date) {
        this.selectedDate.set(date);
    }

    acceptAppointment() {
        if (!this.appointmentMutation.isPending()) {
            this.appointmentMutation.mutate({
                bookingId: this.selectedAppointment!.bookingId,
                action: AppointmentStatuses.ACCEPTED,
            });
        }
    }

    @Confirm({
        title: "Reject appointment",
    })
    rejectAppointment() {
        if (!this.appointmentMutation.isPending()) {
            this.appointmentMutation.mutate({
                bookingId: this.selectedAppointment!.bookingId,
                action: AppointmentStatuses.REJECTED,
            });
        }
    }
}
