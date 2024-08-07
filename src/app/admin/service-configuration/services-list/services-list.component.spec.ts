import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ServicesListComponent } from "./services-list.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentRef } from "@angular/core";
import { Service } from "@types";
import { mockServicesList } from "@/app/utils";
import {
    QueryClient,
    provideAngularQuery,
} from "@tanstack/angular-query-experimental";

describe("ServicesListComponent", () => {
    let component: ServicesListComponent;
    let fixture: ComponentFixture<ServicesListComponent>;
    let componentRef: ComponentRef<ServicesListComponent>;

    const services: Service[] = mockServicesList;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicesListComponent, HttpClientTestingModule],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(ServicesListComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("services", services);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have services", () => {
        expect(component.services()).toEqual(services);
    });

    it("should render the crud table", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("hbp-crud-table")).toBeTruthy();
    });
});
