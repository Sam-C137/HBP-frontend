import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfileSidebarComponent } from "../profile-sidebar/profile-sidebar.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";

describe("ProfileSidebarComponent", () => {
    let component: ProfileSidebarComponent;
    let fixture: ComponentFixture<ProfileSidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ProfileSidebarComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [provideAngularQuery(new QueryClient())],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should match all required links", () => {
        const base = "/patient/profile";
        const links = [
            `${base}/general`,
            `${base}/reviews`,
            `${base}/notifications`,
            `${base}/change-password`,
        ];

        const linkElements = Array.from(
            fixture.nativeElement.querySelectorAll("a"),
        ) as HTMLAnchorElement[];

        linkElements.pop();

        expect(linkElements.length).toBe(links.length);

        linkElements.forEach((link: HTMLAnchorElement, index: number) => {
            expect(link.getAttribute("href")).toBe(links[index]);
        });
    });
});
