import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CrudTableComponent } from "./crud-table.component";

import { SpinnerComponent } from "../../loaders/spinner/spinner.component";
import { ComponentRef } from "@angular/core";
import { UserAvatarComponent } from "../../avatars/user-avatar/user-avatar.component";
import { ServiceAvatarComponent } from "../../avatars/service-avatar/service-avatar.component";
import { headers, keys, mockDoctorList } from "@utils/mockdata";
import type { Doctor } from "@types";

const mockdata = mockDoctorList;

describe("CrudTableComponent", () => {
    let component: CrudTableComponent<Doctor>;
    let componentRef: ComponentRef<CrudTableComponent<Doctor>>;
    let fixture: ComponentFixture<CrudTableComponent<Doctor>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CrudTableComponent,
                UserAvatarComponent,
                ServiceAvatarComponent,
                SpinnerComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CrudTableComponent<Doctor>);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("listName", "mockListName");
        componentRef.setInput("headers", headers);
        componentRef.setInput("keys", keys);
        componentRef.setInput("items", mockdata);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a list name", () => {
        expect(component.listName()).toEqual("mockListName");
    });

    it("should have headers", () => {
        expect(component.headers()).toEqual(headers);
    });

    it("should have keys", () => {
        expect(component.keys()).toEqual(keys);
    });

    it("should have a dropdownActions", () => {
        expect(component.dropdownActions).toBeTruthy();
    });

    it("should have a preset actions", () => {
        expect(component.actions()).toEqual("deactivate");
    });

    it("should have no selected Item", () => {
        expect(component.selectedItem()).toBeUndefined();
    });

    it("should have a falsy loading state", () => {
        expect(component.loading()).toBeFalsy();
    });

    it("should render a table", () => {
        const table = fixture.nativeElement.querySelector("table");
        expect(table).toBeTruthy();
    });
});
