import { NavbarComponent } from "@shared/navbar/navbar.component";
import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    DestroyRef,
    effect,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import { AppointmentBarComponent } from "../appointment-bar/appointment-bar.component";
import { ServiceMiniCardComponent } from "../service-mini-card/service-mini-card.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppointmentDoctorListComponent } from "../appointment-doctor-list/appointment-doctor-list.component";
import { Doctor, PageableItems, Roles, Service } from "@types";
import { FooterComponent } from "@shared/footer/footer.component";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { FormValidator, removeFalsyValues, Title } from "@utils";
import { ActivatedRoute } from "@angular/router";
import { UserManagementService } from "@services/api/user-management.service";
import { debounceTime } from "rxjs";
import {
    injectQuery,
    injectQueryClient,
    keepPreviousData,
} from "@tanstack/angular-query-experimental";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UserService } from "@/app/services/state";

@Component({
    selector: "hbp-home-page",
    standalone: true,
    imports: [
        NavbarComponent,
        AppointmentBarComponent,
        ServiceMiniCardComponent,
        InputComponent,
        AppointmentDoctorListComponent,
        FooterComponent,
        CommonModule,
        SpinnerComponent,
    ],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageComponent implements OnInit {
    @Title
    readonly title = "Home";
    private activatedRoute = inject(ActivatedRoute);
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Doctor,
    );
    public user = inject(UserService).user;
    public services?: PageableItems<Service> | null;
    public currentPage = signal(0);
    protected form: FormGroup;
    protected formValidator: FormValidator;
    private formBuilder = inject(FormBuilder);
    private destroyer$ = inject(DestroyRef);

    queryClient = injectQueryClient();

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        effect(this.prefetch);
    }

    ngOnInit() {
        this.handleFilter();
        this.handleSearch();
        this.getServices();
    }

    private setupForm() {
        return this.formBuilder.group({
            search: ["", [Validators.required]],
            specialization: ["Immunology", [Validators.required]],
        });
    }

    private handleFilter() {
        this.form.controls["specialization"].valueChanges
            .pipe(debounceTime(10), takeUntilDestroyed(this.destroyer$))
            .subscribe(() => {
                this.doctorsQuery.refetch();
            });
    }

    private handleSearch() {
        this.form.controls["search"].valueChanges
            .pipe(debounceTime(500), takeUntilDestroyed(this.destroyer$))
            .subscribe(() => {
                this.doctorsQuery.refetch();
            });
    }

    public changePage(event: CustomEvent) {
        if (this.doctorsQuery.isPending()) return;
        this.currentPage.set(event.detail - 1);
    }

    private getServices() {
        this.activatedRoute.data.subscribe(
            ({ services }: { services?: PageableItems<Service> | null }) => {
                this.services = services;
            },
        );
    }

    protected doctorsQuery = injectQuery(() => ({
        queryKey: ["home-doctors", this.currentPage(), this.form.value],
        queryFn: () =>
            this.userManagementService.getAll(
                removeFalsyValues({
                    ...this.form.value,
                    page: this.currentPage(),
                    status: "active",
                    sort: "rating,desc",
                }),
            ) as Promise<PageableItems<Doctor>>,
        placeholderData: keepPreviousData,
    }));

    private prefetch = () => {
        if (
            !this.doctorsQuery.isPlaceholderData() &&
            this.doctorsQuery.data()
        ) {
            this.queryClient.prefetchQuery({
                queryKey: [
                    "home-doctors",
                    this.currentPage() + 1,
                    this.form.value,
                ],
                queryFn: () =>
                    this.userManagementService.getAll(
                        removeFalsyValues({
                            ...this.form.value,
                            page: this.currentPage() + 1,
                            status: "active",
                        }),
                    ) as Promise<PageableItems<Doctor>>,
            });
        }
    };
}
