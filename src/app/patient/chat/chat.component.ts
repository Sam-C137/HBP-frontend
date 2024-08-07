import { MessagesComponent } from "@/app/doctor/messages/messages.component";
import { NavbarComponent } from "@/app/shared/navbar/navbar.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "hbp-chat",
    standalone: true,
    imports: [NavbarComponent, MessagesComponent],
    template: `
        <main class="screen-fit">
            <hbp-navbar position="relative" />
            <div>
                <hbp-messages />
            </div>
        </main>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
    ngOnInit(): void {
        window.scrollTo(0, 0);
    }
}
