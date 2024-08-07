import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableComponent } from "./table.component";
import { Service } from "@types";
import { ComponentRef } from "@angular/core";

describe("TableComponent", () => {
    let component: TableComponent<Service>;
    let fixture: ComponentFixture<TableComponent<Service>>;
    let componentRef: ComponentRef<TableComponent<Service>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TableComponent<Service>);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("data", []);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
