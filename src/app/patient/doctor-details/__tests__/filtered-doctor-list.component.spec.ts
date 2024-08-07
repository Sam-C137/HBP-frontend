import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FilteredDoctorListComponent } from "../filtered-doctor-list/filtered-doctor-list.component";
import { ComponentRef } from "@angular/core";
import { mockDoctorList } from "@/app/utils";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("FilteredDoctorListComponent", () => {
    let component: FilteredDoctorListComponent;
    let fixture: ComponentFixture<FilteredDoctorListComponent>;
    let componentRef: ComponentRef<FilteredDoctorListComponent>;

    const doctors = mockDoctorList;
    const queryParams = { id: "1234" };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilteredDoctorListComponent, HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(FilteredDoctorListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("doctors", doctors);
        componentRef.setInput("queryParams", queryParams);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
