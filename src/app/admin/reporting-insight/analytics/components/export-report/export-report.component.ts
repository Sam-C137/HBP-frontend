import { popup } from "@/app/libs/animations";
import { SelectValueAccessorDirective } from "@/app/libs/directives";
import { Roles, Service } from "@/app/libs/types";
import { UserManagementService } from "@/app/services/api/user-management.service";
import { ButtonComponent } from "@/app/shared/button/button.component";
import { DatePickerComponent } from "@/app/shared/inputs/date-picker/date-picker.component";
import { DateBuilder, removeFalsyValues } from "@/app/utils";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    DestroyRef,
    inject,
    input,
    model,
    OnInit,
    signal,
    Signal,
} from "@angular/core";
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from "@angular/core/rxjs-interop";
import {
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
} from "@angular/forms";
import {
    injectMutation,
    injectQuery,
} from "@tanstack/angular-query-experimental";
import { debounceTime, tap } from "rxjs";
import { AnalyticsService } from "../../services/analytics.service";
import { ReportPayload } from "../../models/analytics.types";
import { ComboBoxComponent } from "@/app/shared/combo-box/combo-box.component";

@Component({
    selector: "hbp-export-report",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        SelectValueAccessorDirective,
        DatePickerComponent,
        ButtonComponent,
        ComboBoxComponent,
    ],
    templateUrl: "./export-report.component.html",
    styleUrls: [
        "./export-report.component.scss",
        "../../../../../libs/stylesheets/modal.styles.scss",
    ],
    animations: [popup],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportReportComponent implements OnInit {
    doctorServices = input.required<Service[] | undefined>();
    open = model.required<boolean>();
    daysToMilliseconds = DateBuilder.daysToMilliseconds;

    #userManagement = inject(UserManagementService).setRole(Roles.Doctor);
    #analyticsService = inject(AnalyticsService);
    #destroyRef = inject(DestroyRef);
    #nfb = inject(NonNullableFormBuilder);
    search = signal<string>("");

    doctorsQuery = injectQuery(() => ({
        queryKey: ["admin-doctors", this.serviceSignal()?.name],
        queryFn: () =>
            this.#userManagement.getAll(
                removeFalsyValues({
                    search: this.search(),
                    specialization: this.serviceSignal()?.name ?? "",
                }),
            ),
    }));
    downloadMutation = injectMutation(() => ({
        mutationFn: (payload: ReportPayload) =>
            this.#analyticsService.downloadReport(payload),
    }));

    startDateSignal: Signal<string>;
    endDateSignal: Signal<string>;
    serviceSignal: Signal<{ id: string; name: string }>;
    viewByList = computed(() => {
        const startDate = Date.parse(this.startDateSignal());
        const endDate = Date.parse(this.endDateSignal());
        const gap = endDate - startDate;
        if (gap < this.daysToMilliseconds(30)) {
            return ["Weekly"];
        } else if (
            gap >= this.daysToMilliseconds(30) &&
            gap < this.daysToMilliseconds(366)
        ) {
            return ["Monthly", "Weekly"];
        } else {
            return ["Yearly", "Monthly", "Weekly"];
        }
    });

    form: FormGroup;
    today = new Date().toISOString();

    constructor() {
        this.form = this.setupForm();
        this.startDateSignal = toSignal(this.startDate.valueChanges);
        this.endDateSignal = toSignal(this.endDate.valueChanges);
        this.serviceSignal = toSignal(this.services.valueChanges);
        toObservable(this.search)
            .pipe(
                debounceTime(1000),
                tap((value) => {
                    this.onFilterChange(value);
                    this.doctorsQuery.refetch();
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
    }

    ngOnInit(): void {
        this.reportType.valueChanges
            .pipe(
                tap((value) => {
                    if (!value) {
                        this.reportType.setValue("booking-trends", {
                            emitEvent: false,
                        });
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
        this.startDate.valueChanges
            .pipe(
                tap((value) => {
                    if (value > this.endDate.value) {
                        this.endDate.patchValue(value, { emitEvent: false });
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
        this.viewBy.valueChanges
            .pipe(
                tap((value) => {
                    if (!value) {
                        this.viewBy.setValue("WEEKLY", {
                            emitEvent: false,
                        });
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
    }

    setupForm(): FormGroup {
        return this.#nfb.group({
            reportType: ["booking-trends"],
            startDate: [this.today],
            endDate: [this.today],
            services: [],
            doctors: ["All Doctors"],
            viewBy: ["WEEKLY"],
        });
    }

    close() {
        this.open.set(false);
    }

    downloadReport() {
        const { reportType, startDate, endDate, viewBy, services, doctors } =
            this.form.value;
        this.downloadMutation.mutate({
            type: reportType,
            startDate,
            endDate,
            metric: viewBy || "Weekly",
            serviceId: services.name === "All Services" ? null : services.id,
            doctorId: doctors === "All Doctors" ? null : doctors,
        });
    }

    onDoctorChange(doctorId: string) {
        this.doctors.setValue(doctorId);
    }

    onFilterChange(search: string) {
        this.search.set(search);
    }

    get reportType() {
        return this.form.get("reportType") as FormControl;
    }

    get startDate() {
        return this.form.get("startDate") as FormControl;
    }

    get endDate() {
        return this.form.get("endDate") as FormControl;
    }

    get services() {
        return this.form.get("services") as FormControl;
    }

    get doctors() {
        return this.form.get("doctors") as FormControl;
    }

    get viewBy() {
        return this.form.get("viewBy") as FormControl;
    }
}
