import { NavbarComponent } from "@shared/navbar/navbar.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import {
    ActivatedRoute,
    Params,
    Router,
    RouterLink,
    RouterLinkActive,
} from "@angular/router";
import { type Doctor, type PageableItems, Roles } from "@types";
import { FormValidator, removeFalsyValues, Title } from "@utils";
import { FilteredDoctorListComponent } from "../filtered-doctor-list/filtered-doctor-list.component";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { FilterTableComponent } from "../filter-table/filter-table.component";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { UserManagementService } from "@/app/services/api/user-management.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { slidingSidebar } from "@animations";
import { injectQuery } from "@tanstack/angular-query-experimental";

@Component({
    selector: "hbp-doctor-filter-page",
    standalone: true,
    imports: [
        NavbarComponent,
        InputComponent,
        FilteredDoctorListComponent,
        RouterLink,
        RouterLinkActive,
        CommonModule,
        FilterTableComponent,
        BreadcrumbComponent,
    ],
    templateUrl: "./doctor-filter-page.component.html",
    styleUrl: "./doctor-filter-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    animations: [slidingSidebar],
})
export class DoctorFilterPageComponent implements OnInit {
    @Title
    readonly title = "Doctor Search";
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Doctor,
    );

    private activatedRoute = inject(ActivatedRoute);
    #router = inject(Router);
    #destroyRef = inject(DestroyRef);
    protected form: FormGroup;
    protected formValidator: FormValidator;
    private formBuilder = inject(FormBuilder);

    public currentPage = signal(0);
    public selectedService = "";
    public filtersMenuIsVisible = false;

    public newQueryParams = signal<Record<string, string>>({});
    public queryParams = computed(() => ({
        ...this.newQueryParams(),
        page: this.currentPage(),
    }));
    public numberOfDoctorsFound = computed(
        () => this.doctorsQuery.data()?.content?.length ?? 0,
    );

    protected doctorsQuery = injectQuery(() => ({
        queryKey: ["filtered-doctors", this.currentPage()],
        queryFn: () =>
            this.userManagementService.getAll(
                removeFalsyValues({
                    ...this.form.value,
                    ...this.queryParams(),
                    page: this.currentPage(),
                }),
            ) as Promise<PageableItems<Doctor>>,
        staleTime: 0,
    }));

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        this.getParams();
    }

    private setupForm() {
        return this.formBuilder.group({
            name: [""],
            specialty: [""],
            city: [""],
            rating: [""],
            search: [""],
            availability: [[]],
            rank: [[]],
            gender: [""],
        });
    }

    ngOnInit() {
        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const queryParams = {
                    ...this.queryParams(),
                    ...this.convertValueToStrings(this.form.value),
                };
                this.reroute(queryParams);
                this.doctorsQuery.refetch();
            });
    }

    private getParams() {
        this.activatedRoute.queryParams.subscribe((params) => {
            const { specialization } = params;
            this.newQueryParams.set(this.convertValueToStrings(params));
            this.selectedService = specialization;
            // Check the filters in params
            this.form.patchValue({
                rank: this.convertValueToArray(this.newQueryParams()["rank"]),
                availability: this.convertValueToArray(
                    this.newQueryParams()["availability"],
                ),
                gender: this.newQueryParams()["gender"] ?? "",
            });
        });
    }

    public changePage(event: CustomEvent) {
        if (this.doctorsQuery.isPending()) return;
        this.currentPage.set(event.detail - 1);
        this.reroute({ ...this.newQueryParams(), page: event.detail });
    }

    /**
     * Converts string arrays to comma delimited string
     * @param params
     * @returns
     */
    private convertValueToStrings(params: Record<string, string | string[]>) {
        const modifiedParams: Record<string, string> = {};
        for (const paramKey in params) {
            const value = params[paramKey];
            if (typeof value === "string") {
                modifiedParams[paramKey] = value;
            } else {
                modifiedParams[paramKey] = value.join(",");
            }
        }
        return modifiedParams;
    }

    private convertValueToArray(value: string) {
        if (value) {
            return value.split(",");
        }
        return [];
    }

    private reroute(queryParams: Params) {
        this.#router.navigate(["/patient/doctors"], {
            queryParams: removeFalsyValues(queryParams),
            state: { url: this.#router.url },
        });
    }

    public toggleFiltersTable() {
        this.filtersMenuIsVisible = !this.filtersMenuIsVisible;
    }

    get ranks() {
        return this.form.get("rank") as FormArray;
    }

    protected pluralMapping = {
        doctor: {
            "=0": "# doctors",
            "=1": "# doctor",
            other: "# doctors",
        },
    };
}
