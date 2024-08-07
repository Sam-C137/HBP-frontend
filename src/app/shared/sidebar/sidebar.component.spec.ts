import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SidebarComponent } from "./sidebar.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentRef } from "@angular/core";

describe("SidebarComponent", () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let componentRef: ComponentRef<SidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarComponent, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("role", "admin");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should contain admin names", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("a").href).toContain("admin");
    });
});
