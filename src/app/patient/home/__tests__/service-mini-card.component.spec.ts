import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServiceMiniCardComponent } from "../service-mini-card/service-mini-card.component";
import { ComponentRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Service } from "@types";
import { mockServicesList } from "@/app/utils";

describe("ServiceMiniCardComponent", () => {
    let component: ServiceMiniCardComponent;
    let fixture: ComponentFixture<ServiceMiniCardComponent>;
    let componentRef: ComponentRef<ServiceMiniCardComponent>;

    const service: Service = mockServicesList[0];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceMiniCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceMiniCardComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        const form = new FormGroup({
            name: new FormControl(""),
        });
        componentRef.setInput("service", service);
        componentRef.setInput("control", form.get("name"));
        componentRef.setInput("name", "bob");
        componentRef.setInput("value", "muller");

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have recieved all inputs", () => {
        expect(component.name()).toBe("bob");
        expect(component.service()).toEqual(service);
        expect(component.value()).toBe("muller");
    });

    it("should render an avatar", () => {
        const avatar =
            fixture.nativeElement.querySelector("hbp-service-avatar");
        expect(avatar).toBeTruthy();
    });
});
