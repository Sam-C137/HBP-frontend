import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FileAttachmentComponent } from "./file-attachment.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentRef } from "@angular/core";

describe("FileAttachmentComponent", () => {
    let component: FileAttachmentComponent;
    let fixture: ComponentFixture<FileAttachmentComponent>;
    let componentRef: ComponentRef<FileAttachmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FileAttachmentComponent,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FileAttachmentComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput("fileName", "Google");
        componentRef.setInput("fileUrl", "google.com");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
