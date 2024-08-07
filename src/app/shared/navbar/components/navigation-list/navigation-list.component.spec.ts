import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NavigationListComponent } from "./navigation-list.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("NavigationListComponent", () => {
    let component: NavigationListComponent;
    let fixture: ComponentFixture<NavigationListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NavigationListComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavigationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should contain links to the home page", () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("a").textContent).toContain("Home");
    });
});
