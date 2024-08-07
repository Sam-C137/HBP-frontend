import { InputComponent } from "@shared/inputs/input/input.component";
import { HBConfirmableActions } from "@services";
import { Confirm, FormValidator, removeFalsyValues, Title } from "@utils";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    signal,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { UpcomingAppointmentCardComponent } from "../upcoming-appointment-card/upcoming-appointment-card.component";
import { SelectValueAccessorDirective } from "@directives";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { RouterLink } from "@angular/router";
import { AppointmentTableComponent } from "@shared/tables/appointment-table/appointment-table.component";
import { CommonModule } from "@angular/common";
import { Appointment, AppointmentStatuses, Doctor } from "@types";
import { RescheduleAppointmentOverlayComponent } from "@shared/modals/reschedule-appointment-overlay/reschedule-appointment-overlay.component";
import { CancelAppointmentOverlayComponent } from "@shared/modals/cancel-appointment-overlay/cancel-appointment-overlay.component";
import { AppointmentManagementService } from "@services/api/appointment-management.service";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { EmptyListComponent } from "@shared/empty-list/empty-list.component";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { CacheService, UserService } from "@services/state";
import { DOCTOR_APPOINTMENTS_FORM_CACHE_KEY } from "@app/libs/constants";
import { ToastService } from "@/app/shared/toast/toast.service";
import {
    injectMutation,
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";
import { debounceTime, skip } from "rxjs";

@Component({
    selector: "hbp-doctor-appointments-page",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        UpcomingAppointmentCardComponent,
        SpinnerComponent,
        RouterLink,
        AppointmentTableComponent,
        CommonModule,
        SelectValueAccessorDirective,
        RescheduleAppointmentOverlayComponent,
        CancelAppointmentOverlayComponent,
        ErrorHandlerComponent,
        EmptyListComponent,
    ],
    templateUrl: "./doctor-appointments-page.component.html",
    styleUrl: "./doctor-appointments-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorAppointmentsPageComponent extends HBConfirmableActions {
    @Title
    readonly title = "My Appointments";
    protected AppointmentActions = AppointmentStatuses;
    private appointmentManagementService = inject(AppointmentManagementService);
    private doctor = inject(UserService).user;
    private cache = inject(CacheService);
    private toast = inject(ToastService);
    private formBuilder = inject(FormBuilder);
    protected formValidator: FormValidator;
    protected form: FormGroup;
    protected user = inject(UserService).user as Doctor;

    public selectedAppointment: Appointment | undefined;
    public currentPage = signal(0);
    public isRescheduleOpen = false;
    public isCancelOpen = false;
    private client = injectQueryClient();

    override modalLoading = toObservable(
        computed(() => this.toggleAppointmentStatusMutation.isPending()),
    );

    constructor() {
        super();
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        this.handleFormChange();
    }

    private setupForm() {
        return this.formBuilder.group({
            search: [""],
            status: [this.AppointmentActions.PENDING],
            sort: [""],
        });
    }

    protected upcomingAppointmentsQuery = injectQuery(() => ({
        queryKey: ["doctor-upcoming-appointments"],
        queryFn: () =>
            this.appointmentManagementService.getAppointments(
                {
                    status: AppointmentStatuses.ACCEPTED,
                },
                this.doctor?.id,
            ),
    }));

    protected appointmentsQuery = injectQuery(() => ({
        queryKey: ["doctor-appointments", this.currentPage()],
        queryFn: () =>
            this.appointmentManagementService.getAppointments(
                removeFalsyValues(this.form.value),
                this.doctor?.id,
            ),
    }));

    protected toggleAppointmentStatusMutation = injectMutation(() => ({
        mutationFn: (details: {
            bookingId: string | number;
            action: AppointmentStatuses;
        }) =>
            this.appointmentManagementService.toggleAppointmentStatus(
                details,
                this.doctor?.id,
            ),
        onSuccess: async () => {
            await this.invalidateQueries();
        },
    }));

    private handleFormChange() {
        const cache = this.cache.get(DOCTOR_APPOINTMENTS_FORM_CACHE_KEY);
        if (cache) {
            this.form.setValue(cache, { emitEvent: false });
        }
        this.form.valueChanges
            .pipe(skip(1), debounceTime(800), takeUntilDestroyed())
            .subscribe(() => {
                this.cache.set(
                    DOCTOR_APPOINTMENTS_FORM_CACHE_KEY,
                    this.form.value,
                );
                this.appointmentsQuery.refetch();
            });
    }

    @Confirm({
        title: "Reject appointment",
    })
    public rejectAppointment() {
        if (!this.toggleAppointmentStatusMutation.isPending()) {
            this.toggleAppointmentStatusMutation.mutate({
                bookingId: this.selectedAppointment!.bookingId,
                action: AppointmentStatuses.REJECTED,
            });
        }
    }

    public acceptAppointment() {
        if (!this.toggleAppointmentStatusMutation.isPending()) {
            this.toggleAppointmentStatusMutation.mutate({
                bookingId: this.selectedAppointment!.bookingId,
                action: AppointmentStatuses.ACCEPTED,
            });
        }
    }

    public completeAppointment() {
        if (this.toggleAppointmentStatusMutation.isPending()) {
            return;
        }

        const appointmentDate = new Date(
            this.selectedAppointment?.appointmentTime as string,
        );
        appointmentDate.setHours(appointmentDate.getHours() + 1);
        appointmentDate.setSeconds(appointmentDate.getSeconds() + 15);
        const now = new Date();

        if (now < appointmentDate) {
            this.toast.toast({
                message: "You can only complete appointments that have passed",
                status: "error",
            });
            return;
        }

        this.toggleAppointmentStatusMutation.mutate({
            bookingId: this.selectedAppointment!.bookingId,
            action: AppointmentStatuses.COMPLETED,
        });
    }

    public changePage(event: CustomEvent) {
        if (this.appointmentsQuery.isPending()) return;
        this.currentPage.set(event.detail - 1);
    }

    public async invalidateQueries() {
        await this.client.invalidateQueries({
            queryKey: ["doctor-appointments"],
        });
        await this.client.invalidateQueries({
            queryKey: ["doctor-upcoming-appointments"],
        });
    }
}
