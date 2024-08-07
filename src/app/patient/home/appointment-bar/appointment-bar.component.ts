import { ButtonComponent } from "@shared/button/button.component";
import { DatePickerComponent } from "@shared/inputs/date-picker/date-picker.component";
import { InputComponent } from "@shared/inputs/input/input.component";
import { DatePickerValueAccessorDirective } from "@directives";
import { SelectValueAccessorDirective } from "@directives";
import { AppointmentBookingService } from "@services/api/appointment-booking.service";
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
    input,
    signal,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Service } from "@types";
import { LocationService } from "@services/api/location.service";
import { FormValidator, mockServicesList } from "@utils";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "hbp-appointment-bar",
    standalone: true,
    imports: [
        DatePickerValueAccessorDirective,
        SelectValueAccessorDirective,
        ReactiveFormsModule,
        InputComponent,
        DatePickerComponent,
        ButtonComponent,
        RouterLink,
    ],
    templateUrl: "./appointment-bar.component.html",
    styleUrl: "./appointment-bar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentBarComponent implements OnInit {
    specializations = input.required<string[], Service[] | undefined>({
        transform: (items: Service[] | undefined) => {
            if (!items || items.length === 0) {
                return mockServicesList.map((item) => item.name);
            }
            return items.map((item) => item.name);
        },
    });
    private appointmentBookingService = inject(AppointmentBookingService);
    private locationService = inject(LocationService);
    private router = inject(Router);
    private destroyer$ = inject(DestroyRef);
    protected form: FormGroup;
    protected formValidator: FormValidator;
    private formBuilder = inject(FormBuilder);
    protected today = new Date().toISOString();
    public gettingLocation = signal(false);

    constructor() {
        this.form = this.setupForm();
        this.formValidator = new FormValidator(this.form);
    }

    setupForm() {
        return this.formBuilder.group({
            location: ["", [Validators.required]],
            date: [new Date(), [Validators.required]],
            specialization: ["Immunology", [Validators.required]],
        });
    }

    ngOnInit() {
        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyer$))
            .subscribe((value) => {
                this.appointmentBookingService.selectedDate.set(value.date);
            });
    }

    public async submit() {
        await this.router.navigate(["/patient/doctors"], {
            queryParams: {
                date: this.form.value.date.toISOString(),
                specialization: this.form.value.specialization,
            },
        });
    }

    public async useUserLocation() {
        this.gettingLocation.set(true);
        await this.locationService.getCordinates().then(({ long, lat }) => {
            this.locationService
                .getCityFromCordinates(long, lat)
                .subscribe((response) => {
                    const locationControl = this.form.get("location");
                    locationControl?.setValue(response.address.City);
                    locationControl?.disable();
                    this.gettingLocation.set(false);
                });
        });
    }
}
