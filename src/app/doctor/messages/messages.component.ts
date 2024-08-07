import { InputComponent } from "@shared/inputs/input/input.component";
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    HostBinding,
    OnInit,
    inject,
    signal,
} from "@angular/core";
import { Contact, Message } from "./contact/contact.types";
import { ChatSectionComponent } from "./chat-section/chat-section.component";
import { slideUpDelayed, fadeIn, popup } from "@animations";
import { MessageBarComponent } from "./message-bar/message-bar.component";
import { RxStompService } from "@/app/services/api/rx-stomp.service";
import { switchMap, tap } from "rxjs";
import { UserService } from "@/app/services/state";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { injectQueryClient } from "@tanstack/angular-query-experimental";
import { CHAT, CONVERSATION, CONVERSATIONS } from "@/app/libs/constants";
import { addChat, generateChatKey } from "@/app/utils";

@Component({
    selector: "hbp-messages",
    standalone: true,
    imports: [InputComponent, ChatSectionComponent, MessageBarComponent],
    templateUrl: "./messages.component.html",
    styleUrl: "./messages.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn, slideUpDelayed, popup],
})
export class MessagesComponent implements OnInit {
    #chatService = inject(RxStompService);
    #userService = inject(UserService);
    #destroyRef = inject(DestroyRef);

    queryClient = injectQueryClient();
    contacts = signal<Contact[] | undefined>(this.#chatService.getContacts());
    selectedContact = signal<Contact | undefined>(undefined);

    @HostBinding("attr.class")
    get className() {
        return "screen-fit";
    }

    ngOnInit(): void {
        this.#chatService
            .watch({
                destination: `/topic/user/${crypto.randomUUID()}`,
            })
            .pipe(
                switchMap((stream) =>
                    this.#chatService.watch({
                        destination: `/queue/chat/${stream.body}`,
                    }),
                ),
                tap((message) => {
                    const messages = JSON.parse(message.body);
                    if (messages.type === CONVERSATIONS) {
                        this.#chatService.setContacts(messages.body);
                        this.contacts.set(messages.body);
                    } else if (messages.type === CONVERSATION) {
                        const newConversation: Contact = messages.body;
                        this.#chatService.updateContacts(newConversation);
                        this.contacts.set(this.#chatService.getContacts());
                    } else if (messages.type === CHAT) {
                        const message: Message = messages.body;
                        if (
                            this.selectedContact &&
                            this.selectedContact() &&
                            this.selectedContact()?.conversationId ===
                                message.conversationId
                        ) {
                            const confirmationPayload = JSON.stringify({
                                timeStamp: message.timeStamp,
                                conversationId: message.conversationId,
                                userId: this.#userService.user?.id,
                            });
                            this.#chatService.publish({
                                destination: "/app/chat.confirm",
                                body: confirmationPayload,
                            });
                            this.selectedContact.update((contact) => {
                                let messagesWithTimeGroups =
                                    contact?.messages ||
                                    new Map<string, Message[]>();
                                const chatKey = generateChatKey(
                                    message.timeStamp,
                                );
                                messagesWithTimeGroups = addChat(
                                    messagesWithTimeGroups,
                                    chatKey,
                                    message,
                                );
                                if (contact) {
                                    return {
                                        ...contact,
                                        messages: messagesWithTimeGroups,
                                        loading: false,
                                    };
                                }
                                return contact;
                            });
                        }
                    }
                }),
                takeUntilDestroyed(this.#destroyRef),
            )
            .subscribe();
    }
}
