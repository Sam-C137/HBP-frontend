import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    model,
    signal,
} from "@angular/core";
import { Contact } from "../contact/contact.types";
import { InputComponent } from "@shared/inputs/input/input.component";
import { ContactComponent } from "../contact/contact.component";
import { UserService } from "@/app/services/state";
import { RxStompService } from "@/app/services/api/rx-stomp.service";
import { CommonModule } from "@angular/common";
import { FormControl } from "@angular/forms";
import { Roles } from "@/app/libs/types";
import { toSignal } from "@angular/core/rxjs-interop";
import { ContactLoaderComponent } from "@shared/loaders/contact-loader/contact-loader.component";

@Component({
    selector: "hbp-message-bar",
    standalone: true,
    imports: [
        InputComponent,
        ContactComponent,
        CommonModule,
        ContactLoaderComponent,
    ],
    templateUrl: "./message-bar.component.html",
    styleUrl: "./message-bar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBarComponent {
    selectedContact = model<Contact | undefined>();
    contacts = input.required<Contact[] | undefined>();
    searchControl = new FormControl("", { nonNullable: true });
    searchSignal = toSignal(this.searchControl.valueChanges, {
        initialValue: "",
    });
    numberOfActiveContacts = signal(0);
    filteredContacts = computed(() => {
        if (this.contacts()) {
            return this.contacts()!.filter((contact) => {
                if (
                    this.#userService.user?.role === Roles.Doctor &&
                    this.searchSignal()
                ) {
                    return contact.patientsName
                        .toLowerCase()
                        .includes(this.searchSignal().toLowerCase());
                } else if (
                    this.#userService.user?.role === Roles.Patient &&
                    this.searchSignal()
                ) {
                    return contact.doctorsName
                        .toLowerCase()
                        .includes(this.searchSignal().toLowerCase());
                }
                return true;
            });
        }
        return undefined;
    });
    #userService = inject(UserService);
    #chatService = inject(RxStompService);
    role =
        this.#userService.user?.role === Roles.Doctor
            ? Roles.Patient
            : Roles.Doctor;

    constructor() {
        window.scrollTo(0, 0);
        effect(
            () => {
                this.numberOfActiveContacts.set(
                    this.contacts()?.filter(
                        (contact) =>
                            contact.newMessages &&
                            contact.conversationId !==
                                this.selectedContact()?.conversationId,
                    ).length || 0,
                );
            },
            { allowSignalWrites: true },
        );
    }
    onSelectContact(contact: Contact) {
        if (contact.conversationId === this.selectedContact()?.conversationId)
            return;
        if (contact.newMessages) {
            this.numberOfActiveContacts.set(this.numberOfActiveContacts() - 1);
        }
        const chatHistoryPayload = JSON.stringify({
            conversationId: contact.conversationId,
            userId: this.#userService.user?.id,
        });
        const confirmationPayload = JSON.stringify({
            timeStamp: contact.lastChat.timeStamp,
            conversationId: contact.conversationId,
            userId: this.#userService.user?.id,
        });
        this.#chatService.publish({
            destination: "/app/chat.history",
            body: chatHistoryPayload,
        });
        this.#chatService.publish({
            destination: "/app/chat.confirm",
            body: confirmationPayload,
        });
        this.selectedContact.set(contact);
    }
}
