import { InputComponent } from "@shared/inputs/input/input.component";
import { SelectValueAccessorDirective } from "@directives";
import { FormValidator, removeFalsyValues, Title } from "@utils";
import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    effect,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PatientListComponent } from "../patient-list/patient-list.component";
import {
    type Filters,
    UserManagementService,
} from "@services/api/user-management.service";
import { type PageableItems, type Patient, Roles } from "@types";
import { CommonModule } from "@angular/common";
import { debounceTime, of, skip, switchMap } from "rxjs";
import {
    injectQuery,
    injectQueryClient,
    keepPreviousData,
} from "@tanstack/angular-query-experimental";

type FormFields = Omit<Filters, "page" | "size">;

@Component({
    selector: "hbp-patients-page",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        SelectValueAccessorDirective,
        PatientListComponent,
        CommonModule,
    ],
    templateUrl: "./patients-page.component.html",
    styleUrl: "./patients-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PatientsPageComponent implements OnInit {
    @Title
    title = "Patients";
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Patient,
    );
    currentPage = signal(0);
    fb = inject(FormBuilder);
    form: FormGroup;
    formValidator: FormValidator;

    queryClient = injectQueryClient();

    patientsQuery = injectQuery(() => ({
        queryKey: ["admin-patients", this.currentPage(), this.form.value],
        queryFn: () =>
            this.userManagementService.getAll(
                removeFalsyValues({
                    ...this.form.value,
                    page: this.currentPage(),
                }),
            ) as Promise<PageableItems<Patient>>,
        placeholderData: keepPreviousData,
        retry: 0,
    }));

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        effect(this.prefetch);
    }

    setupForm() {
        return this.fb.group({
            search: [""],
            status: [""],
        });
    }

    ngOnInit() {
        this.handleSearch();
    }

    handleSearch() {
        this.form.valueChanges
            .pipe(
                skip(1),
                debounceTime(1000),
                switchMap((params: FormFields) => of(params)),
            )
            .subscribe(() => {
                this.patientsQuery.refetch();
            });
    }

    changePage(event: CustomEvent) {
        if (this.patientsQuery.isLoading()) return;
        this.currentPage.set(event.detail - 1);
    }

    prefetch = () => {
        if (
            !this.patientsQuery.isPlaceholderData() &&
            this.patientsQuery.data()
        ) {
            this.queryClient.prefetchQuery({
                queryKey: [
                    "admin-patients",
                    this.currentPage() + 1,
                    this.form.value,
                ],
                queryFn: () =>
                    this.userManagementService.getAll(
                        removeFalsyValues({
                            ...this.form.value,
                            page: this.currentPage() + 1,
                        }),
                    ) as Promise<PageableItems<Patient>>,
            });
        }
    };
}
