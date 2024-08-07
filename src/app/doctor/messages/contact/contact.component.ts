import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from "@angular/core";
import { Contact } from "./contact.types";
import { DatePipe } from "@angular/common";
import { UserService } from "@/app/services/state";
import { UserAvatarComponent } from "@/app/shared/avatars/user-avatar/user-avatar.component";

@Component({
    selector: "hbp-contact",
    standalone: true,
    imports: [UserAvatarComponent],
    providers: [DatePipe],
    templateUrl: "./contact.component.html",
    styleUrl: "./contact.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
    contact = input.required<Contact>();
    datePipe = inject(DatePipe);
    timeStamp = computed(() => {
        return new Date(this.contact().lastChat.timeStamp);
    });
    isSelected = input.required<boolean>();
    userService = inject(UserService);

    modifyTimeOutput(time: Date) {
        const now = new Date();

        if (time.getDate() === now.getDate() - 1) {
            return "Yesterday";
        } else if (time.getDate() === now.getDate()) {
            return this.datePipe.transform(time, "shortTime");
        } else {
            return this.datePipe.transform(time, "MM/dd/yyyy");
        }
    }
}
