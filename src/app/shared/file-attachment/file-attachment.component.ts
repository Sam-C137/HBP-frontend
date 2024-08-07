/* eslint-disable no-case-declarations */
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    signal,
} from "@angular/core";
import { ToastService } from "../toast/toast.service";
import { FilenamePipe } from "@pipes";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { delay, filter, tap } from "rxjs";

@Component({
    selector: "hbp-file-attachment",
    standalone: true,
    imports: [FilenamePipe],
    templateUrl: "./file-attachment.component.html",
    styleUrl: "./file-attachment.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileAttachmentComponent {
    private http = inject(HttpClient);
    private toastService = inject(ToastService);
    fileUrl = input.required<string>();
    downloadProgress = signal(0);
    fileName = input("medical record");
    useActualFileName = input(false);

    resetDowloadProgres$ = toObservable(this.downloadProgress)
        .pipe(
            filter((progress) => progress >= 100),
            delay(3000),
            tap(() => this.downloadProgress.set(0)),
            takeUntilDestroyed(),
        )
        .subscribe();

    downloadFile(url: string) {
        if (this.downloadProgress() > 0) {
            return;
        }

        const headers = new HttpHeaders().set("Skip-Interceptor", "true");

        this.http
            .get(url, {
                responseType: "blob",
                reportProgress: true,
                observe: "events",
                headers,
            })
            .subscribe({
                error: () => {
                    this.downloadProgress.set(0);

                    this.toastService.toast({
                        message: "Failed to process your download request",
                        status: "error",
                    });
                },
                next: (event) => {
                    switch (event.type) {
                        case HttpEventType.DownloadProgress:
                            this.downloadProgress.set(
                                Math.round(
                                    (event.loaded / (event.total ?? 3000000)) *
                                        100,
                                ),
                            );
                            break;
                        case HttpEventType.Response:
                            const blob = new Blob([event.body as BlobPart]);
                            const downloadURL =
                                window.URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = downloadURL;
                            const filename = url.split("/").pop();
                            link.download = String(filename);
                            link.click();
                            break;
                        default:
                            break;
                    }
                },
            });
    }
}
