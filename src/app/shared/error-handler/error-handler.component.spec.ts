import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorHandlerComponent } from "./error-handler.component";
import { ComponentRef } from "@angular/core";

describe("ErrorHandlerComponent", () => {
    let component: ErrorHandlerComponent;
    let fixture: ComponentFixture<ErrorHandlerComponent>;
    let componentRef: ComponentRef<ErrorHandlerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ErrorHandlerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorHandlerComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default message", () => {
        expect(component.message()).toBe("Couldn't connect. Please try again");
    });

    it("should render a custom message", () => {
        componentRef.setInput("message", "No items found.");
        fixture.detectChanges();
        const message = fixture.nativeElement.querySelector("p");
        expect(message.textContent).toBe("No items found.");
    });

    it("should emit a retry event", () => {
        const retrySpy = spyOn(component.retry, "emit");
        const retryButton = fixture.nativeElement.querySelector("button");
        retryButton.click();
        expect(retrySpy).toHaveBeenCalled();
    });
});
