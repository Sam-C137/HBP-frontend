import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServicesPageComponent } from "./services-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";

describe("ServicesPageComponent", () => {
    let component: ServicesPageComponent;
    let fixture: ComponentFixture<ServicesPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ServicesPageComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(ServicesPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
