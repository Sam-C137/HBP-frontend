import { InputComponent } from "@shared/inputs/input/input.component";
import { SelectValueAccessorDirective } from "@directives";
import { FormValidator, Title } from "@utils";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    effect,
    inject,
    signal,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ServicesListComponent } from "../services-list/services-list.component";
import { ButtonComponent } from "@shared/button/button.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
    Filters,
    ServiceManagementService,
} from "@services/api/service-management.service";
import { debounceTime, of, skip, switchMap } from "rxjs";
import { removeFalsyValues } from "@/app/utils";
import {
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";

type FormFields = Omit<Filters, "page" | "size">;

@Component({
    selector: "hbp-services-page",
    standalone: true,
    imports: [
        InputComponent,
        ButtonComponent,
        SelectValueAccessorDirective,
        ReactiveFormsModule,
        ServicesListComponent,
        RouterLink,
        CommonModule,
    ],
    templateUrl: "./services-page.component.html",
    styleUrl: "./services-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ServicesPageComponent implements OnInit {
    @Title
    title = "Services";
    serviceManagementService = inject(ServiceManagementService);
    currentPage = signal(0);
    queryClient = injectQueryClient();
    fb = inject(FormBuilder);
    form: FormGroup;
    formValidator: FormValidator;

    setupForm() {
        return this.fb.group({
            search: [""],
            status: [""],
        });
    }

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
        effect(this.prefetch);
    }

    ngOnInit() {
        this.handleSearch();
    }

    servicesQuery = injectQuery(() => ({
        queryKey: ["admin-services", this.currentPage(), this.form.value],
        queryFn: () =>
            this.serviceManagementService.getAll(
                removeFalsyValues({
                    ...this.form.value,
                    page: this.currentPage(),
                }),
            ),
        retry: 0,
    }));

    handleSearch() {
        this.form.valueChanges
            .pipe(
                skip(1),
                debounceTime(1000),
                switchMap((params: FormFields) => of(params)),
            )
            .subscribe(() => {
                this.servicesQuery.refetch();
            });
    }

    changePage(event: CustomEvent) {
        if (this.servicesQuery.isLoading()) return;
        this.currentPage.set(event.detail - 1);
    }

    prefetch = () => {
        if (
            !this.servicesQuery.isPlaceholderData() &&
            this.servicesQuery.data()
        ) {
            this.queryClient.prefetchQuery({
                queryKey: [
                    "admin-services",
                    this.currentPage() + 1,
                    this.form.value,
                ],
                queryFn: () =>
                    this.serviceManagementService.getAll(
                        removeFalsyValues({
                            ...this.form.value,
                            page: this.currentPage() + 1,
                        }),
                    ),
            });
        }
    };
}
