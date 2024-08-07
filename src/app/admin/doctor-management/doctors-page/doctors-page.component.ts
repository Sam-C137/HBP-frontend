import { NavbarComponent } from "@shared/navbar/navbar.component";
import { SidebarComponent } from "@shared/sidebar/sidebar.component";
import { ButtonComponent } from "@shared/button/button.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    effect,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import { DoctorListComponent } from "../doctor-list/doctor-list.component";
import { FormValidator, removeFalsyValues, Title } from "@utils";
import { ranks } from "@app/libs/constants";
import { SelectValueAccessorDirective } from "@directives";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InviteDoctorComponent } from "../invite-doctor/invite-doctor.component";
import {
    type Filters,
    UserManagementService,
} from "@services/api/user-management.service";
import { Doctor, type PageableItems, Roles } from "@types";
import { debounceTime, of, skip, switchMap } from "rxjs";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import {
    injectQuery,
    injectQueryClient,
    keepPreviousData,
} from "@tanstack/angular-query-experimental";
import { ServiceManagementService } from "@services/api/service-management.service";

type FormFields = Omit<Filters, "page" | "size">;

@Component({
    selector: "hbp-doctors-page",
    standalone: true,
    imports: [
        NavbarComponent,
        SidebarComponent,
        InputComponent,
        ButtonComponent,
        DoctorListComponent,
        SelectValueAccessorDirective,
        ReactiveFormsModule,
        InviteDoctorComponent,
        CommonModule,
    ],
    templateUrl: "./doctors-page.component.html",
    styleUrl: "./doctors-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorsPageComponent implements OnInit {
    @Title
    title = "Doctors";
    private userManagementService = inject(UserManagementService).setRole(
        Roles.Doctor,
    );
    serviceManagementService = inject(ServiceManagementService);
    fb = inject(FormBuilder);
    ranks = ranks;
    activatedRoute = inject(ActivatedRoute);
    isFiltersOpen = false;
    isInvitationOpen = false;
    currentPage = signal(0);
    form: FormGroup;
    formValidator: FormValidator;

    queryClient = injectQueryClient();

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        effect(this.prefetch);
    }

    setupForm() {
        return this.fb.group({
            search: [""],
            specialization: [""],
            rank: [""],
            status: [""],
        });
    }

    doctorsQuery = injectQuery(() => ({
        queryKey: ["admin-doctors", this.currentPage(), this.form.value],
        queryFn: () =>
            this.userManagementService.getAll(
                removeFalsyValues({
                    ...this.form.value,
                    page: this.currentPage(),
                }),
            ) as Promise<PageableItems<Doctor>>,
        placeholderData: keepPreviousData,
        retry: 0,
    }));

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
                this.doctorsQuery.refetch();
            });
    }

    changePage(event: CustomEvent) {
        if (this.doctorsQuery.isPending()) return;
        this.currentPage.set(event.detail - 1);
    }

    prefetch = () => {
        if (
            !this.doctorsQuery.isPlaceholderData() &&
            this.doctorsQuery.data()
        ) {
            this.queryClient.prefetchQuery({
                queryKey: [
                    "admin-doctors",
                    this.currentPage() + 1,
                    this.form.value,
                ],
                queryFn: () =>
                    this.userManagementService.getAll(
                        removeFalsyValues({
                            ...this.form.value,
                            page: this.currentPage() + 1,
                        }),
                    ) as Promise<PageableItems<Doctor>>,
            });
        }
    };

    services = injectQuery(() => ({
        queryKey: ["services"],
        queryFn: () =>
            this.serviceManagementService.getAll({
                page: 0,
            }),
        retry: 2,
    }));
}
