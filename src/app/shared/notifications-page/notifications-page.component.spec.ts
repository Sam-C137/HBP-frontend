import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationsPageComponent } from "./notifications-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("NotificationsPageComponent", () => {
    let component: NotificationsPageComponent;
    let fixture: ComponentFixture<NotificationsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NotificationsPageComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
